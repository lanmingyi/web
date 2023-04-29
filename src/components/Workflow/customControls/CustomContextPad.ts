import {
    assign
} from 'min-dash';

export default function CustomContextPad(constructor) {
    const {bpmnFactory, config, contextPad, create, elementFactory, injector, translate} = constructor
    if (config.autoPlace !== false) {
        const autoPlace = injector.get('autoPlace', false)
    }
    // contextPad.registerProvider(this)
    contextPad.registerProvider()

    const getContextPadEntries = (autoPlace, bpmnFactory, create, elementFactory, translate) => {
        function appendUserTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
                autoPlace.append(element, shape);
            } else {
                appendUserTaskStart(event, element);
            }
        }

        function appendUserTaskStart(event, element) {
            const shape = elementFactory.createShape({type: 'bpmn:UserTask'});
            create.start(event, shape, element);
        }

        return {
            'append.user-task': {
                group: 'model',
                className: 'bpmn-icon-user-task',
                title: translate('Append') + ' ' + translate('UserTask'),
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
