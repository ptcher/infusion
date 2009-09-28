/*
Copyright 2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/
var demo = demo || {};
(function ($) {
    
    var buildCutpoints = function () {
        var points = [
            {id: "intro-paragraph", selector: "#intro-paragraph"},
            {id: "locations", selector: ".location-list"},
            {id: "wines", selector: "#wines"},
            {id: "wine-row:", selector: ".wine"},
            {id: "wine", selector: ".wine-button"},
            {id: "wine-label", selector: ".wine-name"},
            {id: "canapes", selector: "#canapes"},
            {id: "canape-row:", selector: ".canape"},
            {id: "canape", selector: ".canape-button"},
            {id: "canape-name", selector: ".canape-name"},
            {id: "canape-price", selector: ".canape-price"}
        ];
        return points;
    };

    var buildLocationsSubtree = function () {
        var treeChildren =  [
                {ID: "locations", optionlist: {valuebinding: "locations.codes"},
                              optionnames: {valuebinding: "locations.names"},
                              selection: {valuebinding: "locations.choice"}
                }
            ];
        var locationRows = fluid.explodeSelectionToInputs(demo.data.locations.codes, {
            rowID: "location-row:",
            inputID: "location",
            labelID: "location-label",
            selectID: "locations"
        });
        var tree = fluid.copy(treeChildren).concat(locationRows);
        return tree;
    };

    var buildWineListSubtree = function () {
        var treeChildren =  [
                {ID: "wines", optionlist: {valuebinding: "wineList.codes"},
                              optionnames: {valuebinding: "wineList.names"},
                              selection: {valuebinding: "wineList.choice"}
                }
            ];
        var wineRows = fluid.explodeSelectionToInputs(demo.data.wineList.codes, {
            rowID: "wine-row:",
            inputID: "wine",
            labelID: "wine-label",
            selectID: "wines"
        });
        var tree = fluid.copy(treeChildren).concat(wineRows);
        return tree;
    };

    var buildCanapaListSubtree = function () {
        var treeChildren =  [
                {ID: "canapes", optionlist: {valuebinding: "canapeList.codes"},
                              optionnames: {valuebinding: "canapeList.names"},
                              selection: {valuebinding: "canapeList.choices"}
                }
            ];
        var canapeRows = fluid.transform(demo.data.canapeList.codes, function (opt, index) {
            return {
                ID: "canape-row:",
                children: [
                     {ID: "canape", parentRelativeID: "..::canapes", choiceindex: index},
                     {ID: "canape-name", parentRelativeID: "..::canapes", choiceindex: index},
                     {ID: "canape-price", value: demo.data.canapeList.prices[index]}
                ]
            };
        });
        var tree = fluid.copy(treeChildren).concat(canapeRows);
        return tree;
    };

    var buildComponentTree = function () {
        var introTree = [
            {ID: "intro-paragraph", value: demo.data.strings.intro}
        ];
        var tree = {children: introTree
                                .concat(buildWineListSubtree())
                                    .concat(buildCanapaListSubtree())
                                        .concat(buildLocationsSubtree())
                    };
        return tree;
    };

    // curry the food model into an event listener that updates the display (after waiting a moment
    // to give the renderer a chance to actually update the model)
    var dumpDataModel = function(){
		var timeOut = setTimeout(function () {
console.log(JSON.stringify(demo.data));
            jQuery("#autobound-model").text(JSON.stringify(demo.data));
		}, 50);
    };

    demo.render = function () {
        var applier = fluid.makeChangeApplier(demo.data);
        var options = {
            cutpoints: buildCutpoints(),
            model: demo.data,
            applier: applier,
            autoBind: true,
            debugMode: true
        };
        var componentTree = buildComponentTree();
        applier.modelChanged.addListener("*", function (model, oldModel, changeRequest) {
            dumpDataModel();
        });

        
        dumpDataModel();
        var fullEl = fluid.jById("render");
        fullEl.click (function () {
            fluid.selfRender($("body"), componentTree, options);
        });
    };
})(jQuery);