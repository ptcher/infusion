/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, start, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    
    /***********
     * Demands *
     ***********/
    
    // Supply the templates
    fluid.staticEnvironment.fatPanelUIOptionsTests = fluid.typeTag("fluid.fatPanelUIOptionsTests");
    fluid.demands("fluid.uiOptionsTemplateLoader", "fluid.fatPanelUIOptionsTests", {
        options: {
            prefix: "../../../../components/uiOptions/html/"
        }
    });
    
    fluid.demands("fluid.renderIframe", ["fluid.fatPanelUIOptionsTests"], {
        options: {
            markupProps: {
                src: "../../../../components/uiOptions/html/uiOptionsIframe.html"
            }
        }
    });

    // Supply the table of contents' template URL
    fluid.demands("fluid.tableOfContents", ["fluid.uiEnhancer"], {
        options: {
            templateUrl: "../../../../components/tableOfContents/html/TableOfContents.html"
        }
    });
    
    /******************
     * Test functions *
     ******************/
     
    var moveOptionsTest = function (expected, map, defaultLocation, testOptions) {
        var actual = {};
        testOptions = testOptions || {
            opt1: "option1",
            opt2: "option2"
        };

        fluid.fatPanelUIOptions.moveOptions(testOptions, actual, defaultLocation, map);
        jqUnit.assertDeepEq("The options were move correctly", expected, actual);
    };
    
    $(document).ready(function () {
        fluid.setLogging(true);

        var tests = jqUnit.testCase("FatPanelUIOptions Tests");
        
        /*********************************
         * fluid.fatPanelUIOptions tests *
         *********************************/
         
        tests.test("moveOptions: map all options", function () {
            var expected = {
                new1: {
                    opt1: "option1"
                },
                new2: {
                    opt2: "option2"
                }
            };
            
            var map = {
                opt1: "new1",
                opt2: "new2"
            };
            
            moveOptionsTest(expected, map);
        });
        
        tests.test("moveOptions: map some options, no default location", function () {
            var expected = {
                new1: {
                    opt1: "option1"
                },
                opt2: "option2"
            };
            
            var map = {
                opt1: "new1"
            };
            
            moveOptionsTest(expected, map);
        });
        
        tests.test("moveOptions: no map w/ default location", function () {
            var expected = {
                "new": {
                    opt1: "option1",
                    opt2: "option2"
                }
            };
            
            moveOptionsTest(expected, null, "new");
        });
        
        tests.test("moveOptions: no map, no default location", function () {
            var expected = {
                opt1: "option1",
                opt2: "option2"
            };
            
            moveOptionsTest(expected);
        });
        
        tests.test("mapOptionsTest ", function () {
            var options = {
                selectors: {
                    iframe: ".iframe",
                    textfield: ".textfield",
                    slider: ".slider"
                },       
                components: {      
                    slidingPanel: "slidingPanel",
                    markupRenderer: "markupRenderer",
                    pageEnhancer: "pageEnhancer",
                    eventBinder: "eventBinder",
                    textfield: "textField",
                    slider: "slider"
                },
                model: {
                    value: null,
                    min: 0,
                    max: 100
                }
            };
            
            var expectedOpts = {
                selectors: {
                    iframe: ".iframe"
                },       
                components: {      
                    slidingPanel: "slidingPanel",
                    markupRenderer: "markupRenderer",
                    pageEnhancer: "pageEnhancer",
                    eventBinder: "eventBinder",
                    uiOptionsBridge: {
                        uiOptions: {
                            options: {
                                selectors: {
                                    textfield: ".textfield",
                                    slider: ".slider"
                                },
                                components: { 
                                    textfield: "textField",
                                    slider: "slider"
                                },
                                model: {
                                    value: null,
                                    min: 0,
                                    max: 100
                                }
                            }
                        }
                    }
                }
            };
            
            var mappedOpts = fluid.fatPanelUIOptions.mapOptions(options);
            jqUnit.assertDeepEq("The options were mapped correctly", expectedOpts, mappedOpts);
        });
        
        /***************************************
         * FatPanelUIOptions integration tests *
         ***************************************/
        
        var applierRequestChanges = function (uiOptions, selectionOptions) {
            uiOptions.applier.requestChange("selections.textFont", selectionOptions.textFont);
            uiOptions.applier.requestChange("selections.theme", selectionOptions.theme);
            uiOptions.applier.requestChange("selections.textSize", selectionOptions.textSize);
            uiOptions.applier.requestChange("selections.lineSpacing", selectionOptions.lineSpacing);            
        };
        
        var checkUIOComponents = function (uio) {
            var components = uio.options.components;
            var eventBinderComponents = components.eventBinder.options.components; 
            jqUnit.assertTrue("slidingPanel is present", components.slidingPanel);
            jqUnit.assertTrue("markupRenderer is present", components.markupRenderer);
            jqUnit.assertTrue("pageEnhancer is preset", components.pageEnhancer);
            jqUnit.assertTrue("eventBinder is present", components.eventBinder);
            jqUnit.assertTrue("uiOptionsBridge is present", components.uiOptionsBridge);
            jqUnit.assertTrue("pageEnhancer is present as an eventBinder sub-component", eventBinderComponents.pageEnhancer);
            jqUnit.assertTrue("uiOptions is present as an eventBinder sub-component", eventBinderComponents.uiOptions);
            jqUnit.assertTrue("slidingPanel is present as an eventBinder sub-component", eventBinderComponents.slidingPanel);
            jqUnit.assertTrue("markupRenderer is present as an uiOptionsBridge sub-component", components.uiOptionsBridge.options.components.markupRenderer);
        };        
        
        var checkModelSelections = function (expectedSelections, actualSelections) {
            jqUnit.assertEquals("Text font correctly updated", expectedSelections.textFont, actualSelections.textFont);
            jqUnit.assertEquals("Theme correctly updated", expectedSelections.theme, actualSelections.theme);
            jqUnit.assertEquals("Text size correctly updated", expectedSelections.textSize, actualSelections.textSize);
            jqUnit.assertEquals("Line spacing correctly updated", expectedSelections.lineSpacing, actualSelections.lineSpacing);            
        };
        
        var bwSkin = {
            textSize: "1.8",
            textFont: "verdana",
            theme: "bw",
            lineSpacing: 2
        };
        
        tests.asyncTest("Fat Panel UIOptions Integration tests", function () {
            var that = fluid.fatPanelUIOptions(".flc-uiOptions-fatPanel");
            
            checkUIOComponents(that);

//            that.events.afterRender.addListener(function () {
                that.slidingPanel.showPanel();
                applierRequestChanges(that.uiOptionsBridge.uiOptions, bwSkin);
                checkModelSelections(bwSkin, that.pageEnhancer.uiEnhancer.model);
                that.slidingPanel.hidePanel();
                checkModelSelections(bwSkin, that.uiOptionsBridge.uiOptions.pageEnhancer.uiEnhancer.model);
//            });
            
            // Verify that both uiEnhancers have the same settings applied to them
            //checkModelSelections(that.pageEnhancer.uiEnhancer.model, that.uiOptionsBridge.uiOptions.pageEnhancer.uiEnhancer.model);
            
            //click on reset all and run tests again
            start();
        });        
    });
})(jQuery);        