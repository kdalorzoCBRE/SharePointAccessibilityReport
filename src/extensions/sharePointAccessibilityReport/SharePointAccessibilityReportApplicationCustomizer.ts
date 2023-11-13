import * as React from "react";
import * as ReactDOM from "react-dom";
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderName } from '@microsoft/sp-application-base';

import { IAccessibilityReportTopBarProps, AccessibilityReportTopBar } from "./components/AccessibilityAnnouncement";


export interface ISharePointAccessibilityReportApplicationCustomizerProperties {
  testMessage: string;
}

export default class SharePointAccessibilityReportApplicationCustomizer
  extends BaseApplicationCustomizer<ISharePointAccessibilityReportApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    const placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

    if (!placeholder) {
      const error = new Error('Could not find placeholder Top');
      return Promise.reject(error);
    }

    const element: React.ReactElement<IAccessibilityReportTopBarProps> = React.createElement(
      AccessibilityReportTopBar, { context: this.context }
    );

    ReactDOM.render(element, placeholder.domElement);

    return Promise.resolve();

  }
}