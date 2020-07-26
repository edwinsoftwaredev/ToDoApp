'use strict';

require('jest-preset-angular/build/reflectMetadata');

require('zone.js/dist/zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('jest-preset-angular/build/zone-patch');

var getTestBed = require('@angular/core/testing').getTestBed;
var BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
var platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

/**
 * this file is an extention of the jest-present-angular
 * jest-preset-angular doesnt support jest-puppeteer by default.
 * Further functionality with jest-puppeteer has to be made in this file.
 */
