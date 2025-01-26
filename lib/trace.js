// define a trace mechanism for use with bq

export const create_trace_mechanism = (ocx, options=null) => {
    const {
        trace_enabled       = true,
        trace_initially_on  = true,
        trace_fn_mod        = 10,
        height              = 20,  // ch units
        prefix_width        = 8,
    } = (options ?? {});

    for (const [ variable, name ] of [
        [ trace_fn_mod, 'trace_fn_mod' ],
        [ height,       'height'       ],
        [ prefix_width, 'prefix_width' ],
    ]) {
        if (!Number.isInteger(variable) || variable <= 0) {
            throw new TypeError(`${name} must be a positive integer`);
        }
    }

    let trace_ocx;
    let trace_checkbox;

    let stopped = false;

    let trace_iterations = 0;
    let trace_fn;

    if (!trace_enabled) {
        trace_fn = async () => { return stopped; };
    } else {
        const stop_button = ocx.create_child({
            tag: 'button',
            innerText: 'Stop',
        });
        stop_button.onclick = () => { stopped = true; };

        const trace_controls = ocx.create_child({
            children: [
                {
                    tag: 'label',
                    children: [
                        'Trace',
                        {
                            tag: 'input',
                            attrs: {
                                type: 'checkbox',
                            },
                        },
                    ],
                },
                {
                    tag:       'button',
                    innerText: 'Clear',
                    style: {
                        'font-size':   'x-small',
                        'margin-left': '0.5ch',
                    },
                }
            ],
        });
        trace_checkbox = trace_controls.querySelector('input[type="checkbox"]');
        if (trace_initially_on) {
            trace_checkbox.checked = true;
        }

        const trace_clear_button = trace_controls.querySelector('button');
        trace_clear_button.onclick = () => { if (trace_ocx) trace_ocx.element.innerText = ''; }

        trace_ocx = ocx.create_child_ocx({
            style: {
                'font-family':          'monospace',
                'font-size':            'x-small',
                'white-space':          'nowrap',
                'white-space-collapse': 'preserve',
                'max-height':           `${height}ch`,
                'max-width':            'fit-content',
                padding:                '1em',
                overflow:               'auto',
                border:                 '1px solid var(--theme-ou-rc)',
            },
        });

        let trace_iterations = 0;
        trace_fn = async (...args) => {  // returns true iff stopped
            let prefix     = null
            let get_info   = null
            let regardless = false;
            if (typeof args[args.length-1] === 'boolean') {
                regardless = args.pop();
            }
            switch (args.length) {
            case 0: get_info = 'trace...';                break;
            case 1: get_info = args[0];                   break;
            case 2: prefix = args[0]; get_info = args[1]; break;
            default: throw new TypeError('usage trace_fn([ [ prefix ], get_info ], [ regardless ])');
            }
            if (trace_iterations++ % trace_fn_mod === 0 || regardless) {
                if (trace_enabled && trace_checkbox.checked) {
                    const formatted_prefix = (prefix === null || typeof prefix === 'undefined')
                          ? ''
                          : ( (typeof prefix === 'number')
                              ? sprintf(`%-${prefix_width}d`, prefix)
                              : prefix.toString().padEnd(prefix_width, ' ')
                            );
                    const spacer = (typeof prefix === 'undefined' || prefix === null) ? '' : ' ';
                    const info = (typeof get_info === 'function') ? get_info() : (get_info ?? '');
                    const output_data = sprintf('%s%s%s', formatted_prefix, spacer, info);
                    const trace_output_element = await trace_ocx.printf('%s\n', output_data);
                    const bounding_rect = trace_output_element.getBoundingClientRect();
                    const parent_bounding_rect = trace_output_element.parentElement.getBoundingClientRect();
                    if (bounding_rect.bottom <= parent_bounding_rect.bottom+100) {
                        // only scroll back into view if already at least partially showing
                        // (this is a little heavy-handed; scrollTo() wants the upper-left coordinate)
                        trace_output_element.parentElement.scrollTo(0, trace_output_element.parentElement.scrollHeight);
                    }
                }
            }
            return stopped;
        };
    }

    // return controls
    return {
        trace_fn,             // async ([ [ prefix ], get_info ], [ regardless ]) => stopped; no-op async function if !trace_enabled
        trace_fn_mod,         // from options
        trace_ocx,            // undefined if !trace_enabled
        trace_checkbox,       // undefined if !trace_enabled
        stop:                 (new_state=true) => { stopped = new_state; },
        get_stopped:          () => stopped,
        get_trace_iterations: () => trace_iterations,
    };
};
