﻿/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of style functions.
*/

import _ = require('./lodashMini');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import StyleLeakDetector from './StyleLeakDetector';
import Types = require('../common/Types');

const forbiddenProps: string[] = [
    'wordBreak',
    'appRegion',
    'cursor'
];

export class Styles extends RX.Styles {
    combine<S>(defaultStyle: Types.StyleRuleSet<S>,
            ruleSet: Types.StyleRuleSet<S> | Types.StyleRuleSet<S>[],
            overrideStyle?: Types.StyleRuleSet<S>): Types.StyleRuleSet<S> | Types.StyleRuleSet<S>[] {
        let styles = [defaultStyle];
        if (ruleSet) {
            if (ruleSet instanceof Array) {
                styles = styles.concat(ruleSet);
            } else {
                styles.push(ruleSet);
            }
        }

        if (overrideStyle) {
            styles.push(overrideStyle);
        }

        return styles;
    }

    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet: Types.ViewStyle, cacheStyle: boolean = true): Types.ViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates animated styles that can be used for View
    createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for ScrollView
    createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle: boolean = true): Types.ScrollViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Button
    createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle: boolean = true): Types.ButtonStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for WebView
    createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle: boolean = true): Types.WebViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Text
    createTextStyle(ruleSet: Types.TextStyle, cacheStyle: boolean = true): Types.TextStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Text
    createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle: boolean = true): Types.TextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet: Types.ImageStyle, cacheStyle: boolean = true): Types.ImageStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

     // Creates animated opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet: Types.LinkStyleRuleSet, cacheStyle: boolean = true): Types.LinkStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle: boolean = true): Types.PickerStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    private _adaptStyles<S extends Types.ViewAndImageCommonStyle>(def: S, cacheStyle: boolean): Types.StyleRuleSet<S> {
        let adaptedRuleSet = def;
        if (cacheStyle) {
            StyleLeakDetector.detectLeaks(def);

            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = _.omit<S, S>(adaptedRuleSet, forbiddenProps);
        }

        // Convert text styling
        let textStyle = adaptedRuleSet as Types.TextStyle;
        if (textStyle.font) {
            if (textStyle.font.fontFamily !== undefined) {
                textStyle.fontFamily = textStyle.font.fontFamily;
            }
            if (textStyle.font.fontWeight !== undefined) {
                textStyle.fontWeight = textStyle.font.fontWeight;
            }
            if (textStyle.font.fontStyle !== undefined) {
                textStyle.fontStyle = textStyle.font.fontStyle;
            }
            delete textStyle.font;
        }

        if (cacheStyle) {
            return RN.StyleSheet.create({ _style: adaptedRuleSet })._style;
        }

        return adaptedRuleSet;
    }

    private _adaptAnimatedStyles<T extends Types.AnimatedViewAndImageCommonStyle>(def: T): T {
        return _.omit<T, T>(def, forbiddenProps);
    }
}

export default new Styles();
