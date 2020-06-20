/***********************************************************
 * FILENAME: ThemeProvider.js    TYPE: Context Provider
 *
 * DESCRIPTION:
 *      Global UI theme provider for Goal Mogual applications.
 *
 * AUTHER: Yanxiang Lan     START DATE: 20 June 20
 * UTILIZES: UI Kitten
 * @see https://akveo.github.io/react-native-ui-kitten/docs/
 ***********************************************************/

import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

/*
 * There are a lot more customizations that we can do with the
 * UI kitten theme.
 * Please consult https://akveo.github.io/react-native-ui-kitten/docs/guides/branding.
 */
import { default as theme } from "./theme.json";

function ThemeProvider({ children }) {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      {children}
    </ApplicationProvider>
  );
}

export default ThemeProvider;
