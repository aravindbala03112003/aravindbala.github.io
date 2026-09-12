import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const androidDir = path.join(rootDir, 'android');
const appDir = path.join(androidDir, 'app');

console.log('=== Step 1: Setting up Android Project Structure ===');

// Directories to create
const dirs = [
  androidDir,
  path.join(androidDir, 'gradle', 'wrapper'),
  appDir,
  path.join(appDir, 'src', 'main', 'java', 'com', 'aravindbala', 'portfolio'),
  path.join(appDir, 'src', 'main', 'res', 'values'),
  path.join(appDir, 'src', 'main', 'res', 'mipmap-mdpi'),
  path.join(appDir, 'src', 'main', 'res', 'mipmap-hdpi'),
  path.join(appDir, 'src', 'main', 'res', 'mipmap-xhdpi'),
  path.join(appDir, 'src', 'main', 'res', 'mipmap-xxhdpi'),
  path.join(appDir, 'src', 'main', 'res', 'mipmap-xxxhdpi'),
  path.join(appDir, 'src', 'main', 'assets', 'www'),
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. settings.gradle
fs.writeFileSync(
  path.join(androidDir, 'settings.gradle'),
  `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AravindBalaPortfolio"
include ':app'
`
);

// 2. build.gradle (root)
fs.writeFileSync(
  path.join(androidDir, 'build.gradle'),
  `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.9.1'
    }
}

tasks.register("clean", Delete) {
    delete rootProject.layout.buildDirectory
}
`
);

// 3. local.properties
fs.writeFileSync(
  path.join(androidDir, 'local.properties'),
  `sdk.dir=C:\\\\Users\\\\Asus\\\\AppData\\\\Local\\\\Android\\\\Sdk\n`
);

// 4. gradle.properties
fs.writeFileSync(
  path.join(androidDir, 'gradle.properties'),
  `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\n`
);

// 5. gradle-wrapper.properties
fs.writeFileSync(
  path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.properties'),
  `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
`
);

// 6. Copy gradlew and gradlew.bat from CA/android if available
const caGradlewBat = path.join(rootDir, '..', 'CA', 'android', 'gradlew.bat');
const caGradlew = path.join(rootDir, '..', 'CA', 'android', 'gradlew');
if (fs.existsSync(caGradlewBat)) {
  fs.copyFileSync(caGradlewBat, path.join(androidDir, 'gradlew.bat'));
}
if (fs.existsSync(caGradlew)) {
  fs.copyFileSync(caGradlew, path.join(androidDir, 'gradlew'));
}

// 7. app/build.gradle
fs.writeFileSync(
  path.join(appDir, 'build.gradle'),
  `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.aravindbala.portfolio'
    compileSdk 35

    defaultConfig {
        applicationId "com.aravindbala.portfolio"
        minSdk 24
        targetSdk 35
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            signingConfig signingConfigs.debug
        }
        debug {
            signingConfig signingConfigs.debug
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    packaging {
        resources {
            excludes += '/META-INF/{AL2.0,LGPL2.1}'
        }
    }
}

dependencies {
    // No external runtime library needed - uses native Android SDK WebView
}
`
);

// 8. strings.xml
fs.writeFileSync(
  path.join(appDir, 'src', 'main', 'res', 'values', 'strings.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Aravind Bala</string>
</resources>
`
);

// 9. AndroidManifest.xml
fs.writeFileSync(
  path.join(appDir, 'src', 'main', 'AndroidManifest.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
);

// 10. MainActivity.java
fs.writeFileSync(
  path.join(appDir, 'src', 'main', 'java', 'com', 'aravindbala', 'portfolio', 'MainActivity.java'),
  `package com.aravindbala.portfolio;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Luxury dark theme status and navigation bars matching #07101f
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(0xFF07101F);
        window.setNavigationBarColor(0xFF07101F);

        webView = new WebView(this);
        webView.setBackgroundColor(0xFF07101F);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Register native bridge for reliable PDF download & local interactions
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        // Native download listener fallback
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                if (url != null && (url.contains("resume.pdf") || url.endsWith(".pdf"))) {
                    saveResumeToDownloads();
                } else if (url != null) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                    } catch (Exception ignored) {}
                }
            }
        });

        webView.setWebViewClient(new LocalAssetWebViewClient());

        setContentView(webView);

        // Launch directly into offline local assets
        webView.loadUrl("https://appassets.androidplatform.net/index.html");
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void downloadResume() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    saveResumeToDownloads();
                }
            });
        }
    }

    private void saveResumeToDownloads() {
        try {
            String fileName = "Aravind_Bala_Resume.pdf";
            InputStream is = getAssets().open("www/resume.pdf");

            // Modern Android (API 29+ / Android 10+): Use MediaStore.Downloads
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
                values.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (uri != null) {
                    OutputStream os = getContentResolver().openOutputStream(uri);
                    byte[] buffer = new byte[8192];
                    int len;
                    while ((len = is.read(buffer)) > 0) {
                        os.write(buffer, 0, len);
                    }
                    os.flush();
                    os.close();
                    is.close();

                    Toast.makeText(this, "Resume downloaded to Downloads folder", Toast.LENGTH_LONG).show();

                    try {
                        Intent viewIntent = new Intent(Intent.ACTION_VIEW);
                        viewIntent.setDataAndType(uri, "application/pdf");
                        viewIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(viewIntent, "Open Resume"));
                    } catch (Exception ignored) {}
                    return;
                }
            }

            // Legacy Android fallback (API 24 - 28)
            File downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!downloadDir.exists()) downloadDir.mkdirs();
            File destFile = new File(downloadDir, fileName);
            FileOutputStream fos = new FileOutputStream(destFile);
            byte[] buffer = new byte[8192];
            int len;
            while ((len = is.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
            fos.flush();
            fos.close();
            is.close();

            MediaScannerConnection.scanFile(this, new String[]{destFile.getAbsolutePath()}, new String[]{"application/pdf"}, null);
            Toast.makeText(this, "Resume downloaded to Downloads folder", Toast.LENGTH_LONG).show();

        } catch (Exception e) {
            Toast.makeText(this, "Resume saved: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    private class LocalAssetWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            String host = uri.getHost();
            if ("appassets.androidplatform.net".equals(host)) {
                String path = uri.getPath();
                if (path != null && path.toLowerCase().contains("resume.pdf")) {
                    saveResumeToDownloads();
                    return true;
                }
                return false;
            }
            // For external links (GitHub, LinkedIn, mailto:), launch native apps
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
            } catch (Exception ignored) {
            }
            return true;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if ("appassets.androidplatform.net".equals(uri.getHost())) {
                String path = uri.getPath();
                if (path == null || path.isEmpty() || "/".equals(path)) {
                    path = "index.html";
                } else if (path.startsWith("/")) {
                    path = path.substring(1);
                }

                try {
                    InputStream is = getAssets().open("www/" + path);
                    String mimeType = getMimeType(path);
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Cache-Control", "no-cache");
                    return new WebResourceResponse(mimeType, "UTF-8", 200, "OK", headers, is);
                } catch (Exception e) {
                    // SPA fallback for routing paths without extensions
                    if (!path.contains(".")) {
                        try {
                            InputStream is = getAssets().open("www/index.html");
                            Map<String, String> headers = new HashMap<>();
                            headers.put("Access-Control-Allow-Origin", "*");
                            return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                        } catch (Exception ignored) {}
                    }
                }
            }
            return super.shouldInterceptRequest(view, request);
        }

        private String getMimeType(String path) {
            String lower = path.toLowerCase();
            if (lower.endsWith(".html")) return "text/html";
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
            if (lower.endsWith(".css")) return "text/css";
            if (lower.endsWith(".json") || lower.endsWith(".webmanifest")) return "application/json";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".gif")) return "image/gif";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".mp4")) return "video/mp4";
            if (lower.endsWith(".mp3")) return "audio/mpeg";
            if (lower.endsWith(".pdf")) return "application/pdf";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`
);

// 11. Copy App Icons from public/icons/icon-512.png
const iconSrc = path.join(rootDir, 'public', 'icons', 'icon-512.png');
if (fs.existsSync(iconSrc)) {
  const iconTargets = [
    path.join(appDir, 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher.png'),
    path.join(appDir, 'src', 'main', 'res', 'mipmap-hdpi', 'ic_launcher.png'),
    path.join(appDir, 'src', 'main', 'res', 'mipmap-xhdpi', 'ic_launcher.png'),
    path.join(appDir, 'src', 'main', 'res', 'mipmap-xxhdpi', 'ic_launcher.png'),
    path.join(appDir, 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png'),
  ];
  for (const t of iconTargets) {
    fs.copyFileSync(iconSrc, t);
  }
}

console.log('=== Step 2: Building Web Production Bundle ===');
// Run npm run build from C:/Users/Asus/Documents/portfolio
const docPortfolio = 'C:\\\\Users\\\\Asus\\\\Documents\\\\portfolio';
execSync('npm run build', { cwd: docPortfolio, stdio: 'inherit' });

console.log('=== Step 3: Copying dist/ to Android Assets www/ ===');
const distDir = path.join(rootDir, 'dist');
const wwwDir = path.join(appDir, 'src', 'main', 'assets', 'www');

// Recursive copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      // Avoid copying existing .apk file into the assets
      if (childItemName.endsWith('.apk')) return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean and populate www
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });
copyRecursiveSync(distDir, wwwDir);

console.log('=== Step 4: Compiling Release APK via Gradle ===');
const gradleBat = 'C:\\\\Users\\\\Asus\\\\.gradle\\\\wrapper\\\\dists\\\\gradle-8.11.1-bin\\\\bpt9gzteqjrbo1mjrsomdt32c\\\\gradle-8.11.1\\\\bin\\\\gradle.bat';
const env = {
  ...process.env,
  JAVA_HOME: 'C:\\\\Program Files\\\\Android\\\\Android Studio\\\\jbr',
  ANDROID_HOME: 'C:\\\\Users\\\\Asus\\\\AppData\\\\Local\\\\Android\\\\Sdk',
};

execSync(`"${gradleBat}" assembleRelease`, {
  cwd: androidDir,
  env,
  stdio: 'inherit',
});

console.log('=== Step 5: Publishing APK to public/ and dist/ ===');
const builtApk = path.join(appDir, 'build', 'outputs', 'apk', 'release', 'app-release.apk');
if (!fs.existsSync(builtApk)) {
  throw new Error(`APK build output not found at ${builtApk}`);
}

const targetPublicApk = path.join(rootDir, 'public', 'aravindbala-portfolio.apk');
const targetDistApk = path.join(rootDir, 'dist', 'aravindbala-portfolio.apk');

fs.copyFileSync(builtApk, targetPublicApk);
fs.copyFileSync(builtApk, targetDistApk);

const apkStats = fs.statSync(targetPublicApk);
console.log(`\n🎉 SUCCESS! Standalone APK built and published:`);
console.log(`File: ${targetPublicApk}`);
console.log(`Size: ${(apkStats.size / (1024 * 1024)).toFixed(2)} MB`);
