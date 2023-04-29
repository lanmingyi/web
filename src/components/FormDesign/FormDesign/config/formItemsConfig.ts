// 表单控件项
// 基础控件
export const basicsList = [
  {
    type: "input", // 表单类型  唯一值，根据type判断显示组件
    label: "输入框", // 标题文字
    icon: "icon-write",
    options: {
      type: "text",
      sortValue: 1,
      width: "100%", // 宽度
      defaultValue: "", // 默认值
      placeholder: "请输入", // 没有输入时，提示文字
      clearable: false,
      maxLength: null,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用，false不禁用，true禁用
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    prefix: "",
    suffix: "",
    rules: [
      //验证规则
      {
        required: false, // 必须填写
        message: "必填项"
      }
    ]
  },
  {
    type: "textarea", // 表单类型
    label: "文本框", // 标题文字
    icon: "icon-edit",
    options: {
      width: "100%", // 宽度
      minRows: 4,
      maxRows: 6,
      sortValue: 1,
      maxLength: null,
      defaultValue: "",
      clearable: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      placeholder: "请输入",
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "number", // 表单类型
    label: "数字输入框", // 标题文字
    icon: "icon-number",
    options: {
      width: "100%", // 宽度
      defaultValue: 0, // 默认值
      sortValue: 1,
      min: null, // 可输入最小值
      max: null, // 可输入最大值
      precision: null,
      step: 1, // 步长，点击加减按钮时候，加减多少
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, //是否禁用
      placeholder: "请输入",
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "select", // 表单类型
    label: "下拉选择器", // 标题文字
    icon: "icon-xiala",
    options: {
      width: "100%", // 宽度
      defaultValue: null,
      sortValue: 1,
      multiple: false, // 是否允许多选
      disabled: false, // 是否禁用
      clearable: false, // 是否显示清除按钮
      hidden: false, // 是否隐藏，false显示，true隐藏
      placeholder: "请选择", // 默认提示文字
      dynamicKey: 'code:sex',
      dictCode: 'sex',
      dataType: 'code',
      method: 'post',
      textField: 'text',
      valueField: 'value',
      url: '/system/dicSet/getDicItemByCode',
      options: [
        // 下拉选择项配置
        {
          text: '选项一',
          value: '1'
        }, {
          text: '选项二',
          value: '2'
        }
      ],
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "checkbox",
    label: "多选框",
    icon: "icon-duoxuan1",
    options: {
      disabled: false, //是否禁用
      sortValue: 1,
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: null,
      dynamicKey: 'code:sex',
      dictCode: 'sex',
      dataType: 'code',
      method: 'post',
      textField: 'text',
      valueField: 'value',
      url: '/system/dicSet/getDicItemByCode',
      options: [{
        value: "1",
        text: "选项1"
      },
        {
          value: "2",
          text: "选项2"
        },
        {
          value: "3",
          text: "选项3"
        }
      ],
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "radio", // 表单类型
    label: "单选框", // 标题文字
    icon: "icon-danxuan-cuxiantiao",
    options: {
      sortValue: 1,
      disabled: false, //是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: "", // 默认值
      dynamicKey: 'code:sex',
      dictCode: 'sex',
      dataType: 'code',
      method: 'post',
      textField: 'text',
      valueField: 'value',
      url: '/system/dicSet/getDicItemByCode',
      options: [{
        value: "1",
        text: "选项1"
      },
        {
          value: "2",
          text: "选项2"
        },
        {
          value: "3",
          text: "选项3"
        }
      ],
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "date", // 表单类型
    label: "日期选择框", // 标题文字
    icon: "icon-calendar",
    options: {
      sortValue: 1,
      width: "100%", // 宽度
      defaultValue: "", // 默认值，字符串 12:00:00
      rangeDefaultValue: [], // 默认值，字符串 12:00:00
      range: false, // 范围日期选择，为true则会显示两个时间选择框（同时defaultValue和placeholder要改成数组），
      showTime: false, // 是否显示时间选择器
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      placeholder: "请选择",
      rangePlaceholder: ["开始时间", "结束时间"],
      format: "YYYY-MM-DD", // 展示格式  （请按照这个规则写 YYYY-MM-DD HH:mm:ss，区分大小写）
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "time", // 表单类型
    label: "时间选择框", // 标题文字
    icon: "icon-time",
    options: {
      width: "100%", // 宽度
      sortValue: 1,
      defaultValue: "", // 默认值，字符串 12:00:00
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      placeholder: "请选择",
      format: "HH:mm:ss", // 展示格式
      use12Hours: false,
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "rate", // 表单类型
    label: "评分", // 标题文字
    icon: "icon-pingfen_moren",
    options: {
      defaultValue: 1,
      sortValue: 1,
      max: 5, // 最大值
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      allowHalf: false, // 是否允许半选
      clearable: false, // 是否显示清除按钮
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "slider", // 表单类型
    label: "滑动输入条", // 标题文字
    icon: "icon-menu",
    options: {
      width: "100%", // 宽度
      sortValue: 1,
      defaultValue: 1, // 默认值， 如果range为true的时候，则需要改成数组,如：[12,15]
      disabled: false, // 是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      min: 0, // 最小值
      max: 100, // 最大值
      step: 1, // 步长，取值必须大于 0，并且可被 (max - min) 整除
      showInput: false, // 是否显示输入框，range为true时，请勿开启
      // range: false // 双滑块模式
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "uploadFile", // 表单类型
    label: "上传文件", // 标题文字
    icon: "icon-upload",
    options: {
      defaultValue: '[]',
      multiple: false,
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      drag: false,
      downloadWay: "a",
      dynamicFun: "",
      width: "100%",
      limit: 3,
      data: "{}",
      fileName: "file",
      headers: {},
      sortValue: 1,
      action: "/document/minio/uploadfile",
      placeholder: "上传"
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "uploadImg",
    label: "上传图片",
    icon: "icon-tupian1",
    options: {
      sortValue: 1,
      defaultValue: '[]',
      multiple: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      width: "100%",
      data: "{bucket:zysd-test02}",
      limit: 3,
      placeholder: "上传",
      fileName: "file",
      headers: {},
      action: "/document/minio/uploadfile",
      listType: "picture-card",
      uploadWay: 'minio'
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "treeSelect", // 表单类型
    label: "树选择器", // 标题文字
    icon: "icon-tree",
    options: {
      sortValue: 1,
      disabled: false, //是否禁用
      defaultValue: undefined, // 默认值
      // multiple: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      clearable: false, // 是否显示清除按钮
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
      // treeCheckable: false,
      placeholder: "请选择",
      method: 'post',
      dataType: 'code',
      url: '/system/codeItem/getListByCodeSetIdAndLevelId',
      parameter: 'codeSetId:AGA,levelId:3',
      expandUrl: '/system/codeItem/getListByPid',
      childParams: {
        key: 'pid',
        value: '',
        parentNode: ''
      },
      parentKey: [],
      codeValue: '',
      codeParams: {},
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "cascader", // 表单类型
    label: "级联选择器", // 标题文字
    icon: "icon-guanlian",
    options: {
      disabled: false, //是否禁用
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: null, // 默认值
      showSearch: false, // 是否显示搜索框，搜索选择的项的值，而不是文字
      placeholder: "请选择",
      // clearable: false, // 是否显示清除按钮
      method: 'post',
      dataType: 'code',
      url: '/system/codeItem/getListByCodeSetIdAndLevelId',
      parameter: 'codeSetId:AGA,levelId:3',
      textField: 'text',
      valueField: 'id',
      sortValue: 1,
      expandUrl: '/system/codeItem/getListByPid',
      childParams: {
        key: 'pid',
        value: '',
        parentNode: ''
      },
      parentKey: [],
      codeValue: '',
      codeParams: {},
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "batch",
    label: "动态表格",
    icon: "icon-biaoge",
    list: [],
    options: {
      scrollY: 0,
      sortValue: 1,
      tableName: '', //表名
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      showLabel: false,
      hideSequence: false,
      width: "100%"
    },
    model: "",
    oldModel: "",
    key: ""
  },
  {
    type: "editor",
    label: "富文本",
    icon: "icon-LC_icon_edit_line_1",
    list: [],
    options: {
      height: 300,
      sortValue: 1,
      placeholder: "请输入",
      defaultValue: "",
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false,
      showLabel: false,
      width: "100%",
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    type: "switch", // 表单类型
    label: "开关", // 标题文字
    icon: "icon-kaiguan3",
    options: {
      sortValue: 1,
      defaultValue: false, // 默认值 Boolean 类型
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },

  {
    type: "button", // 表单类型
    label: "按钮", // 标题文字
    icon: "icon-button-remove",
    options: {
      type: "primary",
      ghost: false,
      handle: "submit",
      dynamicFun: "",
      icon: '',
      shape: null,
      size: 'default',
      block: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false // 是否禁用，false不禁用，true禁用
    },
    key: "",
    model: "", // 数据字段
    oldModel: ""
  },
  {
    type: "alert",
    label: "警告提示",
    icon: "icon-jinggao",
    options: {
      type: "success",
      description: "",
      showIcon: false,
      banner: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      closable: false
    },
    key: "",
    model: "", // 数据字段
    oldModel: ""
  },
  {
    type: "text",
    label: "文字",
    icon: "icon-zihao",
    options: {
      width: '100%',
      sortValue: 1,
      lineHeight: '',
      textAlign: "left",
      hidden: false, // 是否隐藏，false显示，true隐藏
      showRequiredMark: false,
      textSize: '14',
      textColor: 'rgba(0,0,0,.65)',
      textBold: false,
      textItalic: false,
      textUnderline: false,
      textStrikethrough: false,
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    key: "",
    model: "", // 数据字段
    oldModel: ""
  },
  {
    type: "html",
    label: "HTML",
    icon: "icon-ai-code",
    options: {
      sortValue: 1,
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: "<strong>HTML</strong>"
    },
    key: "",
    model: "", // 数据字段
    oldModel: ""
  }
];

// 高级控件
// 自定义组件
export const customComponents = [
  {
    label: "图标选择器",
    type: "icon",
    icon: "meh",
    options: {
      defaultValue: '',
      disabled: false,
      placeholder: "图标选择器",
      hidden: false, // 是否隐藏，false显示，true隐藏
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    label: "颜色选择器",
    type: "color",
    icon: "heart",
    options: {
      defaultValue: 'rgba(85, 170, 255, 0.5)',
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      showPreColor: false, //显示预制颜色
      showHistoryColor: true, //显示历史
      formatType: 'hex', //rgba hex hsla,初始颜色类型
      showPalette: true, //显示色盘
      canMove: true, //默认为true
      size: 'default'
    },
    model: "",
    oldModel: "",
    key: ""
  },
  {
    label: "人员选择器",
    type: "userPop",
    icon: "user",
    options: {
      defaultValue: '',
      disabled: false,
      placeholder: "请选择用户",
      multiple: true,
      hidden: false, // 是否隐藏，false显示，true隐藏
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    label: "组织机构",
    type: "depart",
    icon: "apartment",
    options: {
      defaultValue: '',
      disabled: false,
      placeholder: "请选择组织机构",
      hidden: false, // 是否隐藏，false显示，true隐藏
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  {
    label: "省市区",
    type: "area",
    icon: "deployment-unit",
    options: {
      defaultValue: '',
      disabled: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      areaType: 'select',
      searchAble: false, // 是否可搜索，false不禁用，true禁用
      sortValue: 1,
    },
    model: "",
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  // {
  //   label: "倒计时",
  //   type: "countdown",
  //   icon: "deployment-unit",
  //   options: {
  // 	defaultValue:Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
  //     disabled: false,
  //     placeholder: "",
  //     hidden: false, // 是否隐藏，false显示，true隐藏
  // 	areaType:'select'
  //   },
  //   model: "",
  //   oldModel: "",
  //   key: "",
  //   rules: [
  //     {
  //       required: false,
  //       message: "必填项"
  //     }
  //   ]
  // },
  // {
  //   label: "字典标签",
  //   type: "codeTag",
  //   options: {
  // 	defaultValue:'',
  //     disabled: false,
  //     placeholder: "",
  //     hidden: false, // 是否隐藏，false显示，true隐藏
  //   },
  //   model: "",
  //   oldModel: "",
  //   key: "",
  //   rules: [
  //     {
  //       required: false,
  //       message: "必填项"
  //     }
  //   ]
  // }
]

// 布局控件
export const layoutList = [
  {
    type: "divider",
    label: "分割线",
    icon: "icon-fengexian",
    options: {
      orientation: "left",
      // type: 'horizontal',
      dashed: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      text: ''
    },
    key: "",
    model: "",
    oldModel: ""
  },
  {
    type: "card",
    label: "卡片布局",
    icon: "icon-qiapian",
    list: [],
    options: {
      bordered: true
    },
    key: "",
    model: "",
    oldModel: ""
  },
  {
    type: "nestedColumn",
    label: "多级表头",
    icon: "icon-qiapian",
    list: [],
    options: {
      colName: '',
      sortValue: 1,
    },
    key: "",
    model: "",
    oldModel: ""
  },
  {
    type: "hidden",
    label: "隐藏表单",
    icon: "icon-eyeclose",
    list: [],
    options: {},
    key: "",
    model: "",
    oldModel: ""
  },
  {
    type: "tabs",
    label: "标签页布局",
    icon: "icon-tabs",
    options: {
      tabBarGutter: null,
      type: "line",
      tabPosition: "top",
      size: "default",
      animated: true
    },
    columns: [{
      value: "1",
      label: "选项1",
      list: []
    },
      {
        value: "2",
        label: "选项2",
        list: []
      }
    ],
    key: "",
    model: "",
    oldModel: "",
  },
  {
    type: "grid",
    label: "栅格布局",
    icon: "icon-zhage",
    columns: [{
      span: 12,
      list: []
    },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      type: 'default',
      gutter: 0,
      justify: 'start',
      align: 'top',
      tableStyle: false,
      formBorder: false,
      // gridHeight: 40,
      customStyle: 'form-tabel-border'
    },
    key: "",
    model: "",
    oldModel: ""
  },
  {
    type: "table",
    label: "表格布局",
    icon: "icon-biaoge",
    trs: [{
      tds: [{
        colspan: 1,
        rowspan: 1,
        list: []
      },
        {
          colspan: 1,
          rowspan: 1,
          list: []
        }
      ]
    },
      {
        tds: [{
          colspan: 1,
          rowspan: 1,
          list: []
        },
          {
            colspan: 1,
            rowspan: 1,
            list: []
          }
        ]
      }
    ],
    options: {
      width: "100%",
      bordered: false,
      bright: false,
      small: true,
      customStyle: "",
      formBorder: false
    },
    key: "",
    model: "",
    oldModel: ""
  }
];


//业务组件
export const customerList = [
  //流水号类型
  //输入固定值与日期格式自动生成流水号前缀
  {
    type: "sequenceNumber", // 表单类型  唯一值，根据type判断显示组件
    label: "流水输入框", // 标题文字
    icon: "icon-write",
    options: {
      type: "sequenceNumber",
      width: "100%", // 宽度
      defaultValue: {
        date: '',
        number: ''
      }, // 默认值
      placeholder: "请输入", // 没有输入时，提示文字
      sequenceNumberPrefix: "",
      sequenceNumberLength: 5, // 流水位数
      clearable: false,
      inputYear: true, // 是否需要输入年份
      inputMonth: true, // 是否需要输入月份
      inputDay: true, // 是否需要输入日期
      searchAble: false, // 是否可搜索，false不禁用，true禁用
      isAutoComplete: true, //禁止输入并由后端计算生成
      hidden: false, // 是否隐藏，false显示，true隐藏
      sortValue: 1,
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  //计算类型
  //自定义公式与参数位置
  {
    type: "calculator", // 表单类型  唯一值，根据type判断显示组件
    label: "计算公式", // 标题文字
    icon: "icon-write",
    options: {
      type: "calculator",
      width: "100%", // 宽度
      defaultValue: '', // 默认值
      calculatorType: "GUI", //公式输入格式
      //GUI 图形用户界面输入
      //Code 公式字符输入
      placeholder: "请输入", // 没有输入时，提示文字
      isStatic: false,
      hidden: false, // 是否隐藏，false显示，true隐藏
      sortValue: 1,
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  //关联查询类型
  //跨表搜索内容
  {
    type: "associate", // 表单类型  唯一值，根据type判断显示组件
    label: "关联查询", // 标题文字
    icon: "icon-write",
    options: {
      type: "associate",
      sortValue: 1,
      width: "100%", // 宽度
      hidden: false, // 是否隐藏，false显示，true隐藏
      defaultValue: {                                 // 默认值
        search: {
          tableName: '',                          //引用表名，需要用户操作选择
          field: '',                              //引用字段，选择表明后获取字段列表，需要用户操作选择
          dataType: 'string',                     //引用字段的数据类型，范围[string, number, datetime, other]，无需用户操作
          match: 'first',                         //获取过滤后结果集后的匹配规则，返回唯一的数据，范围[max, min, first, count]，需要用户操作选择
          matchIndex: 0,                          //仅match为count可用，用户输入结果集索引数，需要用户输入
          sort: 'ctAsc',                          //结果集排序方式，范围[ctAsc, ctEsc]，需要用户操作选择
        },
        filter: [],                                 //过滤判断式集合，选择引用字段后，数据集会经过集合内判断式的过滤
        //filter数据例：
        // {
        //     operate: 'eq',                       //选择判断操作符，范围[lt, le, eq, gt, ge, ne, include]，需要用户操作选择
        //     filterType: 'field',                 //判断对象的类型选择，范围[field, constant]，需要用户操作选择
        //     filterValue: '',                     //仅filterType为constant可用，判断对象的数值，需要用户输入
        //     filterField: '',                     //仅filterType为field可用，选择判断对象字段，只可选择本表的字段并受dataType数据影响，需要用户操作选择
        // }
      },
      isStatic: false,                                //设置是否为静态数据，当为true时，保存时即可把数据录入库中，为false时，仅在引用时开始查询，需要用户操作选择
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    rules: [{
      required: false,
      message: "必填项"
    }]
  },
  //地理位置
  {
    type: "yPosition", // 表单类型  唯一值，根据type判断显示组件
    label: "地理位置", // 标题文字
    icon: "icon-write",
    options: {
      type: "text",
      sortValue: 1,
      width: "100%", // 宽度
      defaultValue: "", // 默认值
      placeholder: "请输入", // 没有输入时，提示文字
      clearable: false,
      maxLength: null,
      hidden: false, // 是否隐藏，false显示，true隐藏
      disabled: false, // 是否禁用，false不禁用，true禁用
      searchAble: false, // 是否可搜索，false不禁用，true禁用
    },
    model: "", // 数据字段
    oldModel: "",
    key: "",
    prefix: "",
    suffix: "",
    rules: [
      //验证规则
      {
        required: false, // 必须填写
        message: "必填项"
      }
    ]
  },
]
