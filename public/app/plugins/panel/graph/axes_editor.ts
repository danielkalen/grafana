import _ from 'lodash';
import kbn from 'app/core/utils/kbn';

export class AxesEditorCtrl {
  panel: any;
  panelCtrl: any;
  unitFormats: any;
  logScales: any;
  xAxisModes: any;
  xAxisStatOptions: any;
  xNameSegment: any;
  xAxisLastOptions: any;

  /** @ngInject **/
  constructor(private $scope, private $q) {
    this.panelCtrl = $scope.ctrl;
    this.panel = this.panelCtrl.panel;
    this.$scope.ctrl = this;

    this.unitFormats = kbn.getUnitFormats();

    this.logScales = {
      linear: 1,
      'log (base 2)': 2,
      'log (base 10)': 10,
      'log (base 32)': 32,
      'log (base 1024)': 1024,
    };

    this.xAxisModes = {
      Time: 'time',
      Series: 'series',
      Histogram: 'histogram',
      // 'Data field': 'field',
    };

    this.xAxisStatOptions = [
      { text: 'Avg', value: 'avg' },
      { text: 'Min', value: 'min' },
      { text: 'Max', value: 'max' },
      { text: 'Total', value: 'total' },
      { text: 'Count', value: 'count' },
      { text: 'Current', value: 'current' },
    ];

    if (this.panel.xaxis.mode === 'custom') {
      if (!this.panel.xaxis.name) {
        this.panel.xaxis.name = 'specify field';
      }
    }
  }

  setUnitFormat(axis, subItem) {
    axis.format = subItem.value;
    this.panelCtrl.render();
  }

  render() {
    this.panelCtrl.render();
  }

  getxAxisStatOptions() {
    var firstItem = this.panelCtrl.dataList[0];
    if (firstItem && firstItem.type === 'table') {
      var result = firstItem.columns.map((column, index) => {
        return { text: column.text, value: index + '' };
      });
      if (this.xAxisLastOptions && _.isEqual(this.xAxisLastOptions, result)) {
        result = this.xAxisLastOptions;
      }
      return (this.xAxisLastOptions = result);
    } else {
      return this.xAxisStatOptions;
    }
  }

  xAxisModeChanged() {
    this.panelCtrl.processor.setPanelDefaultsForNewXAxisMode();
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  xAxisValueChanged() {
    this.panelCtrl.onDataReceived(this.panelCtrl.dataList);
  }

  getDataFieldNames(onlyNumbers) {
    var props = this.panelCtrl.processor.getDataFieldNames(this.panelCtrl.dataList, onlyNumbers);
    var items = props.map(prop => {
      return { text: prop, value: prop };
    });

    return this.$q.when(items);
  }
}

/** @ngInject **/
export function axesEditorComponent() {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'public/app/plugins/panel/graph/axes_editor.html',
    controller: AxesEditorCtrl,
  };
}
