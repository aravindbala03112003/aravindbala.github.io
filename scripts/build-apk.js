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
  path.join(appDir, 'src', 'main', 'assets'),
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

// 6. Copy gradlew and gradlew.bat if available
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
        versionCode 3
        versionName "2.0.1"
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
    // Standard Android SDK WebView & widgets
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
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

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

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.MediaScannerConnection;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final String TAG = "AravindPortfolio";
    private static final String PRODUCTION_URL = "https://aravindbala03112003.github.io/aravindbala.github.io/";

    // Palette tokens matching existing dark luxury design
    private static final int COLOR_NAVY = 0xFF07101F;
    private static final int COLOR_CYAN = 0xFF38BDF8;
    private static final int COLOR_LIME = 0xFF4ADE80;
    private static final int COLOR_TEXT_MUTED = 0xFF94A3B8;
    private static final int COLOR_WHITE = 0xFFF8FAFC;
    private static final int COLOR_CARD_BG = 0xFF0B1728;

    private WebView webView;
    private LinearLayout loadingLayout;
    private LinearLayout errorLayout;
    private TextView loadingStatus;
    private TextView errorTitle;
    private TextView errorMessage;
    private Button retryButton;
    private Button browserButton;

    private boolean isPageLoaded = false;
    private boolean hasError = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // System status and navigation bars matching luxury #07101f
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(COLOR_NAVY);
        window.setNavigationBarColor(COLOR_NAVY);

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(COLOR_NAVY);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 1. Core Portfolio WebView
        webView = new WebView(this);
        webView.setBackgroundColor(COLOR_NAVY);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));
        rootLayout.addView(webView);

        configureWebSettings();

        // Register bridge for resume & interactive callbacks
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        // Native download listener
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                if (url != null && (url.toLowerCase().contains("resume.pdf") || url.toLowerCase().endsWith(".pdf"))) {
                    saveResumeToDownloads();
                } else if (url != null) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception ignored) {}
                }
            }
        });

        // 2. Setup Loading View
        createLoadingView(rootLayout);

        // 3. Setup Error View
        createErrorView(rootLayout);

        // 4. Attach WebView navigation & lifecycle clients
        setupWebViewClients();

        setContentView(rootLayout);

        // 5. Start loading production portfolio
        loadPortfolio();
    }

    private void configureWebSettings() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " AravindPortfolioApp/2.0.1");
    }

    private int dpToPx(int dp) {
        return (int) TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP, dp, getResources().getDisplayMetrics()
        );
    }

    private void createLoadingView(FrameLayout rootLayout) {
        loadingLayout = new LinearLayout(this);
        loadingLayout.setOrientation(LinearLayout.VERTICAL);
        loadingLayout.setGravity(Gravity.CENTER);
        loadingLayout.setBackgroundColor(COLOR_NAVY);
        loadingLayout.setPadding(dpToPx(32), dpToPx(32), dpToPx(32), dpToPx(32));
        loadingLayout.setLayoutParams(new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // App Logo / Avatar
        ImageView logoView = new ImageView(this);
        logoView.setImageResource(R.mipmap.ic_launcher);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(dpToPx(72), dpToPx(72));
        logoParams.bottomMargin = dpToPx(20);
        logoView.setLayoutParams(logoParams);
        loadingLayout.addView(logoView);

        // Title
        TextView titleView = new TextView(this);
        titleView.setText("ARAVIND BALA");
        titleView.setTextColor(COLOR_WHITE);
        titleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        titleView.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        titleView.setGravity(Gravity.CENTER);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            titleView.setLetterSpacing(0.08f);
        }
        loadingLayout.addView(titleView);

        // Subtitle
        TextView subtitleView = new TextView(this);
        subtitleView.setText("Software Developer Portfolio");
        subtitleView.setTextColor(COLOR_CYAN);
        subtitleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        subtitleView.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        subtitleView.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        subParams.topMargin = dpToPx(4);
        subParams.bottomMargin = dpToPx(28);
        subtitleView.setLayoutParams(subParams);
        loadingLayout.addView(subtitleView);

        // Modern Indeterminate Spinner
        ProgressBar pb = new ProgressBar(this);
        LinearLayout.LayoutParams pbParams = new LinearLayout.LayoutParams(dpToPx(40), dpToPx(40));
        pbParams.bottomMargin = dpToPx(16);
        pb.setLayoutParams(pbParams);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            pb.setIndeterminateTintList(android.content.res.ColorStateList.valueOf(COLOR_CYAN));
        }
        loadingLayout.addView(pb);

        // Status text
        loadingStatus = new TextView(this);
        loadingStatus.setText("Connecting to portfolio...");
        loadingStatus.setTextColor(COLOR_TEXT_MUTED);
        loadingStatus.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        loadingStatus.setGravity(Gravity.CENTER);
        loadingLayout.addView(loadingStatus);

        rootLayout.addView(loadingLayout);
    }

    private void createErrorView(FrameLayout rootLayout) {
        errorLayout = new LinearLayout(this);
        errorLayout.setOrientation(LinearLayout.VERTICAL);
        errorLayout.setGravity(Gravity.CENTER);
        errorLayout.setBackgroundColor(COLOR_NAVY);
        errorLayout.setPadding(dpToPx(28), dpToPx(28), dpToPx(28), dpToPx(28));
        errorLayout.setVisibility(View.GONE);
        errorLayout.setLayoutParams(new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // Card Container
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setGravity(Gravity.CENTER);
        card.setPadding(dpToPx(24), dpToPx(28), dpToPx(24), dpToPx(28));

        GradientDrawable cardBg = new GradientDrawable();
        cardBg.setColor(COLOR_CARD_BG);
        cardBg.setCornerRadius(dpToPx(16));
        cardBg.setStroke(dpToPx(1), 0xFF1E293B);
        card.setBackground(cardBg);

        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        cardParams.gravity = Gravity.CENTER;
        card.setLayoutParams(cardParams);

        // Warning Badge Icon
        TextView badge = new TextView(this);
        badge.setText("!");
        badge.setTextColor(COLOR_CYAN);
        badge.setTextSize(TypedValue.COMPLEX_UNIT_SP, 26);
        badge.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        badge.setGravity(Gravity.CENTER);
        GradientDrawable badgeBg = new GradientDrawable();
        badgeBg.setColor(0x2238BDF8);
        badgeBg.setShape(GradientDrawable.OVAL);
        badgeBg.setStroke(dpToPx(2), COLOR_CYAN);
        badge.setBackground(badgeBg);
        LinearLayout.LayoutParams badgeParams = new LinearLayout.LayoutParams(dpToPx(52), dpToPx(52));
        badgeParams.bottomMargin = dpToPx(16);
        badge.setLayoutParams(badgeParams);
        card.addView(badge);

        // Error Title
        errorTitle = new TextView(this);
        errorTitle.setText("Connection Unavailable");
        errorTitle.setTextColor(COLOR_WHITE);
        errorTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 19);
        errorTitle.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        errorTitle.setGravity(Gravity.CENTER);
        card.addView(errorTitle);

        // Error Message
        errorMessage = new TextView(this);
        errorMessage.setText("Unable to load the live portfolio. Please check your internet connection.");
        errorMessage.setTextColor(COLOR_TEXT_MUTED);
        errorMessage.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        errorMessage.setGravity(Gravity.CENTER);
        errorMessage.setLineSpacing(dpToPx(2), 1.15f);
        LinearLayout.LayoutParams msgParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
        );
        msgParams.topMargin = dpToPx(8);
        msgParams.bottomMargin = dpToPx(24);
        errorMessage.setLayoutParams(msgParams);
        card.addView(errorMessage);

        // Retry Button
        retryButton = new Button(this);
        retryButton.setText("Retry Connection");
        retryButton.setTextColor(COLOR_NAVY);
        retryButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        retryButton.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        GradientDrawable btnBg = new GradientDrawable();
        btnBg.setColor(COLOR_CYAN);
        btnBg.setCornerRadius(dpToPx(24));
        retryButton.setBackground(btnBg);
        retryButton.setPadding(dpToPx(28), dpToPx(12), dpToPx(28), dpToPx(12));
        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                retryLoading();
            }
        });
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(46)
        );
        btnParams.bottomMargin = dpToPx(10);
        retryButton.setLayoutParams(btnParams);
        card.addView(retryButton);

        // Secondary Browser Button
        browserButton = new Button(this);
        browserButton.setText("Open in Web Browser");
        browserButton.setTextColor(COLOR_CYAN);
        browserButton.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        browserButton.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        GradientDrawable browserBg = new GradientDrawable();
        browserBg.setColor(Color.TRANSPARENT);
        browserBg.setCornerRadius(dpToPx(24));
        browserBg.setStroke(dpToPx(1), 0x5538BDF8);
        browserButton.setBackground(browserBg);
        browserButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(PRODUCTION_URL));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception ignored) {}
            }
        });
        LinearLayout.LayoutParams browserParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(42)
        );
        browserButton.setLayoutParams(browserParams);
        card.addView(browserButton);

        errorLayout.addView(card);
        rootLayout.addView(errorLayout);
    }

    private void setupWebViewClients() {
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (newProgress >= 100 && !hasError) {
                    hideLoading();
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG + "-JS", consoleMessage.message() + " [" + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + "]");
                return super.onConsoleMessage(consoleMessage);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (!hasError) {
                    showLoading("Loading portfolio...");
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (!hasError) {
                    isPageLoaded = true;
                    hideLoading();
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                // Only present full error state when the top-level main frame fails
                if (request.isForMainFrame()) {
                    CharSequence desc = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) ? error.getDescription() : "Connection failed";
                    Log.e(TAG, "Main frame navigation error: " + desc);
                    showError("Connection Failed", "Unable to load portfolio (" + desc + "). Please check your network and tap Retry.");
                }
            }

            @SuppressWarnings("deprecation")
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                if (failingUrl != null && failingUrl.startsWith(PRODUCTION_URL)) {
                    Log.e(TAG, "Legacy main navigation error: " + description);
                    showError("Connection Failed", "Unable to load portfolio (" + description + "). Please check your network and tap Retry.");
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                if (request.isForMainFrame() && errorResponse.getStatusCode() >= 400) {
                    Log.e(TAG, "HTTP error on main frame: " + errorResponse.getStatusCode());
                    showError("Server Error", "Received HTTP error " + errorResponse.getStatusCode() + ". Please tap Retry.");
                }
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // Strictly adhere to security: do not bypass SSL errors
                handler.cancel();
                Log.e(TAG, "SSL error: " + error.toString());
                showError("Secure Connection Failed", "SSL certificate verification failed. Please check your network security.");
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                return handleUrl(uri);
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(Uri.parse(url));
            }
        });
    }

    private boolean handleUrl(Uri uri) {
        if (uri == null) return false;
        String url = uri.toString();

        // 1. Resume download
        if (url.toLowerCase().contains("resume.pdf") || url.toLowerCase().endsWith(".pdf")) {
            saveResumeToDownloads();
            return true;
        }

        // 2. Stay inside WebView if navigating on the portfolio domain
        if (url.startsWith(PRODUCTION_URL)) {
            return false;
        }

        // 3. External links: GitHub, LinkedIn, mailto, tel, etc.
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            return true;
        } catch (Exception e) {
            Toast.makeText(this, "No application found to handle this link", Toast.LENGTH_SHORT).show();
            return true;
        }
    }

    private void loadPortfolio() {
        hasError = false;
        showLoading("Connecting to portfolio...");

        if (!isNetworkConnected()) {
            showError("No Internet Connection",
                      "A network connection is required to load your latest portfolio. Please check your Wi-Fi or mobile data.");
            return;
        }

        webView.loadUrl(PRODUCTION_URL);
    }

    private void retryLoading() {
        showLoading("Retrying connection...");
        loadPortfolio();
    }

    private void showLoading(String message) {
        if (loadingStatus != null) loadingStatus.setText(message);
        if (loadingLayout != null) {
            loadingLayout.setVisibility(View.VISIBLE);
            loadingLayout.setAlpha(1.0f);
        }
        if (errorLayout != null) {
            errorLayout.setVisibility(View.GONE);
        }
    }

    private void hideLoading() {
        if (loadingLayout != null && loadingLayout.getVisibility() == View.VISIBLE) {
            loadingLayout.animate()
                .alpha(0f)
                .setDuration(250)
                .setListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        if (loadingLayout != null) {
                            loadingLayout.setVisibility(View.GONE);
                        }
                    }
                });
        }
    }

    private void showError(String title, String message) {
        hasError = true;
        if (loadingLayout != null) loadingLayout.setVisibility(View.GONE);
        if (errorTitle != null) errorTitle.setText(title);
        if (errorMessage != null) errorMessage.setText(message);
        if (errorLayout != null) errorLayout.setVisibility(View.VISIBLE);
    }

    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Network activeNetwork = cm.getActiveNetwork();
            if (activeNetwork == null) return false;
            NetworkCapabilities cap = cm.getNetworkCapabilities(activeNetwork);
            return cap != null && (
                cap.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                cap.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                cap.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
            );
        } else {
            NetworkInfo ni = cm.getActiveNetworkInfo();
            return ni != null && ni.isConnected();
        }
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
            InputStream is = null;
            try {
                is = getAssets().open("resume.pdf");
            } catch (Exception ignored) {}

            if (is == null) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(PRODUCTION_URL + "resume.pdf"));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                return;
            }

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
                        viewIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(Intent.createChooser(viewIntent, "Open Resume"));
                    } catch (Exception ignored) {}
                    return;
                }
            }

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

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.clearHistory();
            if (webView.getParent() instanceof ViewGroup) {
                ((ViewGroup) webView.getParent()).removeView(webView);
            }
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
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

// 12. Copy resume.pdf to assets for instant native download
const resumeSrc = path.join(rootDir, 'public', 'resume.pdf');
const assetsDir = path.join(appDir, 'src', 'main', 'assets');
const oldWww = path.join(assetsDir, 'www');
if (fs.existsSync(oldWww)) {
  fs.rmSync(oldWww, { recursive: true, force: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
if (fs.existsSync(resumeSrc)) {
  fs.copyFileSync(resumeSrc, path.join(assetsDir, 'resume.pdf'));
}

console.log('=== Step 2: Building Web Production Bundle ===');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

console.log('=== Step 3: Compiling Release APK via Gradle ===');
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

console.log('=== Step 4: Publishing APK to public/ and dist/ ===');
const builtApk = path.join(appDir, 'build', 'outputs', 'apk', 'release', 'app-release.apk');
if (!fs.existsSync(builtApk)) {
  throw new Error(`APK build output not found at ${builtApk}`);
}

const targetPublicApk = path.join(rootDir, 'public', 'aravindbala-portfolio.apk');
const targetDistApk = path.join(rootDir, 'dist', 'aravindbala-portfolio.apk');

fs.copyFileSync(builtApk, targetPublicApk);
fs.copyFileSync(builtApk, targetDistApk);

const apkStats = fs.statSync(targetPublicApk);
const sizeMB = apkStats.size / (1024 * 1024);
console.log(`\n🎉 SUCCESS! Standalone APK built and published:`);
console.log(`File: ${targetPublicApk}`);
console.log(`Size: ${sizeMB.toFixed(2)} MB (${apkStats.size} bytes)`);
console.log(`Target Download Filename: aravindbala-portfolio-v2.0.1.apk`);

if (apkStats.size > 50 * 1024 * 1024) {
  throw new Error(`❌ CRITICAL: Final APK size (${sizeMB.toFixed(2)} MB) exceeds 50 MB limit!`);
} else {
  console.log(`✅ VERIFIED: APK size is within the 50 MB limit!`);
}
