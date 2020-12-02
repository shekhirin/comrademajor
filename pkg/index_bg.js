import * as wasm from './index_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
*/
export function main_js() {
    wasm.main_js();
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {File} file
* @param {any} js_processor
*/
export function processFile(file, js_processor) {
    _assertClass(file, File);
    var ptr0 = file.ptr;
    file.ptr = 0;
    wasm.processFile(ptr0, addHeapObject(js_processor));
}

/**
*/
export const LocationKind = Object.freeze({ SWEAR:0,"0":"SWEAR", });
/**
*/
export const FileKind = Object.freeze({ Unknown:0,"0":"Unknown",Comments:1,"1":"Comments",Messages:2,"2":"Messages", });
/**
*/
export class Comment {

    static __wrap(ptr) {
        const obj = Object.create(Comment.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_comment_free(ptr);
    }
    /**
    * @returns {string}
    */
    get text() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.comment_text(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Array<Location>}
    */
    get highlightedParts() {
        var ret = wasm.comment_highlightedParts(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {string | undefined}
    */
    get url() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.comment_url(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_export_2.value += 16;
        }
    }
}
/**
*/
export class File {

    static __wrap(ptr) {
        const obj = Object.create(File.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_file_free(ptr);
    }
    /**
    * @returns {number}
    */
    get kind() {
        var ret = wasm.__wbg_get_file_kind(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {Uint8Array} data
    * @param {Array<string>} path
    * @param {number} kind
    */
    constructor(data, path, kind) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.file_new(ptr0, len0, addHeapObject(path), kind);
        return File.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get data() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.file_data(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_2.value += 16;
        }
    }
    /**
    * @returns {Array<string>}
    */
    get path() {
        var ret = wasm.file_path(this.ptr);
        return takeObject(ret);
    }
}
/**
*/
export class Kludge {

    static __wrap(ptr) {
        const obj = Object.create(Kludge.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_kludge_free(ptr);
    }
    /**
    * @param {string} attachment_link
    */
    constructor(attachment_link) {
        var ptr0 = passStringToWasm0(attachment_link, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.kludge_new(ptr0, len0);
        return Kludge.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get attachmentLink() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.comment_text(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Location {

    static __wrap(ptr) {
        const obj = Object.create(Location.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_location_free(ptr);
    }
    /**
    * @returns {number}
    */
    get start() {
        var ret = wasm.__wbg_get_location_start(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set start(arg0) {
        wasm.__wbg_set_location_start(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get end() {
        var ret = wasm.__wbg_get_location_end(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set end(arg0) {
        wasm.__wbg_set_location_end(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get kind() {
        var ret = wasm.__wbg_get_location_kind(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set kind(arg0) {
        wasm.__wbg_set_location_kind(this.ptr, arg0);
    }
}
/**
*/
export class Message {

    static __wrap(ptr) {
        const obj = Object.create(Message.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_message_free(ptr);
    }
    /**
    * @returns {number}
    */
    get id() {
        var ret = wasm.__wbg_get_location_start(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set id(arg0) {
        wasm.__wbg_set_location_start(this.ptr, arg0);
    }
    /**
    * @returns {string}
    */
    get dialogName() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.message_dialogName(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string | undefined}
    */
    get author() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.message_author(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_export_2.value += 16;
        }
    }
    /**
    * @returns {string | undefined}
    */
    get authorURL() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.message_authorURL(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v0;
            if (r0 !== 0) {
                v0 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1);
            }
            return v0;
        } finally {
            wasm.__wbindgen_export_2.value += 16;
        }
    }
    /**
    * @returns {string}
    */
    get date() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.message_date(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get text() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.message_text(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Array<Kludge>}
    */
    get kludges() {
        var ret = wasm.message_kludges(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Array<Location>}
    */
    get highlightedParts() {
        var ret = wasm.message_highlightedParts(this.ptr);
        return takeObject(ret);
    }
}

export const __wbg_new_e13110f81ae347cf = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_location_new = function(arg0) {
    var ret = Location.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_push_b46eeec52d2b03bb = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_from_2a5d647e62275bfd = function(arg0) {
    var ret = Array.from(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_length_079c4e509ec6d375 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_get_27693110cb44e852 = function(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_comment_f60074448ef4ddeb = function(arg0, arg1) {
    getObject(arg0).comment(Comment.__wrap(arg1));
};

export const __wbg_message_cbae4d78d715c684 = function(arg0, arg1) {
    getObject(arg0).message(Message.__wrap(arg1));
};

export const __wbg_kludge_new = function(arg0) {
    var ret = Kludge.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

