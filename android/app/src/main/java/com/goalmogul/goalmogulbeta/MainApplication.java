package com.goalmogul.goalmogulbeta;

import android.app.Application;
import android.content.Context;
import android.net.Uri;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.goalmogul.goalmogulbeta.generated.BasePackageList;
//import com.moengage.core.LogLevel;
import com.moengage.core.MoEngage;
//import com.moengage.core.config.GeofenceConfig;
//import com.moengage.core.config.LogConfig;
//import com.moengage.core.config.NotificationConfig;
//import com.moengage.core.internal.logger.Logger;
import com.moengage.core.model.IntegrationPartner;
//import com.moengage.firebase.MoEFireBaseHelper;
//import com.moengage.inapp.MoEInAppHelper;
//import com.moengage.pushbase.MoEPushHelper;
import com.segment.analytics.Analytics;
import com.segment.analytics.android.integrations.moengage.MoEngageIntegration;
import org.unimodules.adapters.react.ReactAdapterPackage;
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.Package;
import org.unimodules.core.interfaces.SingletonModule;
import expo.modules.updates.UpdatesController;

import com.facebook.react.bridge.JSIModulePackage;
// import com.swmansion.reanimated.ReanimatedJSIModulePackage;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
    new BasePackageList().getPackageList()
  );

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new ModuleRegistryAdapter(mModuleRegistryProvider));
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

  //  @Override
  //  protected JSIModulePackage getJSIModulePackage() {
  //    return new ReanimatedJSIModulePackage();
  //  }

    @Override
    protected @Nullable String getJSBundleFile() {
      if (BuildConfig.DEBUG) {
        return super.getJSBundleFile();
      } else {
        return UpdatesController.getInstance().getLaunchAssetFile();
      }
    }

    @Override
    protected @Nullable String getBundleAssetName() {
      if (BuildConfig.DEBUG) {
        return super.getBundleAssetName();
      } else {
        return UpdatesController.getInstance().getBundleAssetName();
      }
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Analytics analytics = new Analytics.Builder(this, "Us6yuw9KLihsRmpihcB5OXTYwT4GDq75")
      .use(MoEngageIntegration.FACTORY)
      .build();

    MoEngage moEngage = new MoEngage.Builder(this, "UKA6LOAR56FL8SI1JILW1YQC")
            .enablePartnerIntegration(IntegrationPartner.SEGMENT)
            .build();
    MoEngage.initialise(moEngage);

    if (!BuildConfig.DEBUG) {
      UpdatesController.initialize(this);
    }

    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.goalmogul.goalmogulbeta.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}