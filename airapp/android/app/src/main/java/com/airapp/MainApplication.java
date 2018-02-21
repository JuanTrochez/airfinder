package com.airapp;

import android.content.Intent;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.oney.WebRTCModule.WebRTCModulePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
   public boolean isDebug() {
       // Make sure you are using BuildConfig from your own application
       return BuildConfig.DEBUG;
   }

   protected List<ReactPackage> getPackages() {
       // Add additional packages you require here
       // No need to add RnnPackage and MainReactPackage
       return Arrays.<ReactPackage>asList(
           new FBSDKPackage(mCallbackManager),
           new WebRTCModulePackage()
           // eg. new VectorIconsPackage()
       );
   }

   @Override
   public List<ReactPackage> createAdditionalReactPackages() {
       return getPackages();
   }

   @Override
   public String getJSMainModuleName() {
      return "index";
  }

    @Override
    public void onCreate() {
        super.onCreate();
        // To get FBSDK to work
        setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                mCallbackManager.onActivityResult(requestCode, resultCode, data);
            }
        });
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
        SoLoader.init(this, /* native exopackage */ false);
    }
}
