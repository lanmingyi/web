import {
    assign
} from 'min-dash';

// export default function CustomContextPad(constructor) {
//     const {bpmnFactory, config, contextPad, create, elementFactory, injector, translate} = constructor
//     if (config.autoPlace !== false) {
//         const autoPlace = injector.get('autoPlace', false)
//     }
//     // contextPad.registerProvider(this)
//     contextPad.registerProvider()
//
//     const getContextPadEntries = (autoPlace, bpmnFactory, create, elementFactory, translate) => {
//         function appendUserTask(event, element) {
//             if (autoPlace) {
//                 const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
//                 autoPlace.append(element, shape);
//             } else {
//                 appendUserTaskStart(event, element);
//             }
//         }
//
//         function appendUserTaskStart(event, element) {
//             const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
//             create.start(event, shape, element);
//         }
//
//         return {
//             'append.user-task': {
//                 group: 'model',
//                 className: 'bpmn-icon-user-task',
//                 title: translate('Append') + ' ' + translate('UserTask'),
//                 action: {
//                     click: appendUserTask,
//                     dragstart: appendUserTaskStart
//                 }
//             }
//         }
//     }
//
// }
//
// CustomContextPad.$inject = [
//     'bpmnFactory',
//     'config',
//     'contextPad',
//     'create',
//     'elementFactory',
//     'injector',
//     'translate'
// ]


export default class CustomContextPad {
    static $inject: string[]
    bpmnFactory: any
    create: any
    elementFactory: any
    translate: any
    autoPlace: any

    constructor (bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
        this.bpmnFactory = bpmnFactory
        this.create = create
        this.elementFactory = elementFactory
        this.translate = translate

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false)
        }

        contextPad.registerProvider(this)
    }

    getContextPadEntries (element) {
        const {autoPlace, bpmnFactory, create, elementFactory, translate} = this

        function appendUserTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
                autoPlace.append(element, shape);
            } else {
                appendUserTaskStart(event);
            }
        }

        // function appendUserTaskStart(event) {
        function appendUserTaskStart(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
            create.start(event, shape, element);
        }

        return {
            'append.user-task': {
                group: 'model',
                className: 'bpmn-icon-user-task',
                title: translate('Append')+' '+translate('UserTask'),
                action: {
                    click: appendUserTask,
                    dragstart: appendUserTaskStart
                }
            }
        }
    }
}

CustomContextPad.$inject = [
    'bpmnFactory',
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
]
