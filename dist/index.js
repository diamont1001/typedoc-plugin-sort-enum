import { Converter, Renderer, ReflectionKind, ParameterType, } from 'typedoc';
export function load(app) {
    app.options.addDeclaration({
        name: 'sortEnumStrategy',
        type: ParameterType.String,
        defaultValue: 'value',
        help: 'Sort enums by "key" or "value" (default: value)',
    });
    app.converter.on(Converter.EVENT_END, context => {
        const strategy = app.options.getValue('sortEnumStrategy');
        // All enums in the project
        const enums = context.project.getReflectionsByKind(ReflectionKind.Enum);
        enums.forEach(enumRefl => {
            const enumReflection = enumRefl;
            if (!enumReflection.children)
                return;
            const members = enumReflection.children.map(member => ({
                reflection: member,
                value: getEnumValue(member),
            }));
            console.log('[Converter.EVENT_END] before sort', enumReflection.children.map(item => item.name));
            enumReflection.children.sort((a, b) => {
                if (strategy === 'key')
                    return a.name.localeCompare(b.name);
                const aVal = members.find(m => m.reflection === a)?.value;
                const bVal = members.find(m => m.reflection === b)?.value;
                // console.log('a: ', a.name, 'aVal: ', aVal, 'b: ', b.name, 'bVal: ', bVal);
                return compareValues(aVal ?? '', bVal ?? '');
            });
            console.log('[Converter.EVENT_END] after sort', enumReflection.children.map(item => item.name));
        });
    }, -100 // 低优先级确保最后执行
    );
    app.renderer.on(Renderer.EVENT_BEGIN, context => {
        const enums = context.project.getReflectionsByKind(ReflectionKind.Enum);
        const enumReflection = enums[0];
        if (!enumReflection.children)
            return;
        console.log('[Renderer.EVENT_BEGIN]', enumReflection.children.map(item => item.name));
    });
    app.renderer.on(Renderer.EVENT_BEGIN_PAGE, context => {
        const enums = context.project.getReflectionsByKind(ReflectionKind.Enum);
        const enumReflection = enums[0];
        if (!enumReflection.children)
            return;
        console.log('[Renderer.EVENT_BEGIN_PAGE]', enumReflection.children.map(item => item.name));
    });
    app.renderer.on(Renderer.EVENT_END_PAGE, context => {
        const enums = context.project.getReflectionsByKind(ReflectionKind.Enum);
        const enumReflection = enums[0];
        if (!enumReflection.children)
            return;
        console.log('[Renderer.EVENT_END_PAGE]', enumReflection.children.map(item => item.name));
    });
    app.renderer.on(Renderer.EVENT_END, context => {
        const enums = context.project.getReflectionsByKind(ReflectionKind.Enum);
        const enumReflection = enums[0];
        if (!enumReflection.children)
            return;
        console.log('[Renderer.EVENT_END]', enumReflection.children.map(item => item.name));
    });
}
function getEnumValue(member) {
    // 方法1：访问 defaultValue
    if (typeof member.defaultValue !== 'undefined') {
        const num = Number(member.defaultValue);
        return isNaN(num) ? String(member.defaultValue) : num;
    }
    // 方法2：访问 type.value（参考：typedoc/src/lib/utils/sort.ts:91
    if (member.type?.type === 'literal' && typeof member.type.value !== 'undefined') {
        const num = Number(member.type.value);
        return isNaN(num) ? String(member.type.value) : num;
    }
    // 方法3：处理自动递增
    const parent = member.parent;
    if (parent?.kind === ReflectionKind.Enum && parent.children) {
        const index = parent.children.indexOf(member);
        if (index > 0) {
            const prevValue = getEnumValue(parent.children[index - 1]);
            if (typeof prevValue === 'number')
                return prevValue + 1;
        }
    }
    // 方法4：回退到名称
    return member.name;
}
function compareValues(a, b) {
    const numA = safeNumber(a);
    const numB = safeNumber(b);
    if (numA !== null && numB !== null)
        return numA - numB;
    if (numA !== null)
        return -1;
    if (numB !== null)
        return 1;
    return String(a).localeCompare(String(b));
}
function safeNumber(value) {
    const num = typeof value === 'number' ? value : Number(value);
    return isNaN(num) ? null : num;
}
