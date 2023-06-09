// export default function CustomPalette(create, elementFactory, palette, translate) {
//     palette.registerProvider();
//
//     function getPaletteEntries (create, elementFactory, translate) {
//         function createServiceTask(event) {
//             const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
//             create.start(event, shape);
//         }
//
//         function createCallActivity(event) {
//             const shape = elementFactory.createShape({type: 'bpmn:CallActivity'});
//             create.start(event, shape);
//         }
//
//         return {
//             'create.user-task': {
//                 group: 'activity',
//                 className: 'bpmn-icon-user-task',
//                 title: translate('Create UserTask'),
//                 action: {
//                     dragstart: createServiceTask,
//                     click: createServiceTask
//                 }
//             },
//             'create.call-activity': {
//                 group: 'activity',
//                 className: 'bpmn-icon-call-activity',
//                 title: translate('Create CallActivity'),
//                 action: {
//                     dragstart: createCallActivity,
//                     click: createCallActivity
//                 }
//             }
//         };
//     }
// }
//
// CustomPalette.$inject = [
//     'create',
//     'elementFactory',
//     'palette',
//     'translate'
// ];

export default class CustomPalette {
    static $inject: string[]
    create: any
    elementFactory: any
    translate: any

    constructor(create, elementFactory, palette, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        palette.registerProvider(this);
    }

    getPaletteEntries() {
        const {create,elementFactory,translate} = this;

        function createServiceTask(event) {
            const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
            create.start(event, shape);
        }

        function createCallActivity(event) {
            const shape = elementFactory.createShape({type: 'bpmn:CallActivity'});
            create.start(event, shape);
        }


        return {
            'create.user-task': {
                group: 'activity',
                className: 'bpmn-icon-user-task',
                title: translate('Create UserTask'),
                action: {
                    dragstart: createServiceTask,
                    click: createServiceTask
                }
            },
            'create.call-activity': {
                group: 'activity',
                className: 'bpmn-icon-call-activity',
                title: translate('Create CallActivity'),
                action: {
                    dragstart: createCallActivity,
                    click: createCallActivity
                }
            }
        };
    }
}

CustomPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate'
];