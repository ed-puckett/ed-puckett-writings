export class Direction {
    // public:

    static {
        Object.defineProperties(this, {  // make these properties immutable
            E_ch: { enumerable: true, value: '>' },
            N_ch: { enumerable: true, value: '^' },
            W_ch: { enumerable: true, value: '<' },
            S_ch: { enumerable: true, value: 'v' },
        });
    }

    // internal:

    static #directions = {
        //                     ch         name   dr  dc    left_ch    right_ch   back_ch
        [this.E_ch]: new this( this.E_ch, 'E',    0,  1,   this.N_ch, this.S_ch, this.W_ch ),
        [this.N_ch]: new this( this.N_ch, 'N',   -1,  0,   this.W_ch, this.E_ch, this.S_ch ),
        [this.W_ch]: new this( this.W_ch, 'W',    0, -1,   this.S_ch, this.N_ch, this.E_ch ),
        [this.S_ch]: new this( this.S_ch, 'S',    1,  0,   this.E_ch, this.W_ch, this.N_ch ),
    };

    static #permissable_chars    = [ this.E_ch, this.N_ch, this.W_ch, this.S_ch ];
    static #permissable_chars_re = new RegExp(`^[${this.#permissable_chars.join('')}]*$`);

    // public:

    static {
        Object.defineProperties(this, {  // make these properties immutable
            E: { enumerable: true, value: this.#directions[this.E_ch] },
            N: { enumerable: true, value: this.#directions[this.N_ch] },
            W: { enumerable: true, value: this.#directions[this.W_ch] },
            S: { enumerable: true, value: this.#directions[this.S_ch] },
        });
    }

    static from(dir_ch) {
        if (!(dir_ch in this.#directions)) {
            throw new Error('invalid dir_ch');
        }
        return this.#directions[dir_ch];
    }

    static from_offsets(offset_r, offset_c) {
        // linear search, but over a small number of elements...
        return this.dirs().find(dir => (dir.dr === Math.sign(offset_r) && dir.dc === Math.sign(offset_c)));
    }

    static chars() { return Object.keys(this.#directions); }
    static dirs()  { return this.chars().map(dir_ch => this.from(dir_ch)); }

    static permissable_chars    (){ return [ ...this.#permissable_chars ]; }
    static permissable_chars_re (){ return this.#permissable_chars_re; }

    // note: don't call constructor, use static methods to get pre-defined instances
    // this is here to show the public properties it defines
    constructor(ch, name, dr, dc, left_ch, right_ch, back_ch) {
        Object.defineProperties(this, {  // make these properties immutable
            ch:       { enumerable: true, value: ch },
            name:     { enumerable: true, value: name },
            dr:       { enumerable: true, value: dr },
            dc:       { enumerable: true, value: dc },
            left_ch:  { enumerable: true, value: left_ch },
            right_ch: { enumerable: true, value: right_ch },
            back_ch:  { enumerable: true, value: back_ch },
        });
    }

    // Would rather define left, right and back as properties in the constructor
    // but get error: TypeError: Cannot read private member #directions from
    // an object whose class did not declare it

    get left  (){ return this.constructor.#directions[this.left_ch]; }
    get right (){ return this.constructor.#directions[this.right_ch]; }
    get back  (){ return this.constructor.#directions[this.back_ch]; }
}
