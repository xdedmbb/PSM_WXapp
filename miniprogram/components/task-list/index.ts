Component({
    properties: {
      tasks: {
        type: Array,
        value: []
      },
      layout: {
        type: String,
        value: 'double' // 默认：日历页用双列布局
      },
      showDesc: {
        type: Boolean,
        value: false
      }
    }
  });
  