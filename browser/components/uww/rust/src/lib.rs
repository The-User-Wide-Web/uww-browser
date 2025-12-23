use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};
use std::sync::Mutex;
use lazy_static::lazy_static;
use nudge_network::{MultipathDispatcher, MultipathConfig, PathResult};

lazy_static! {
    static ref DISPATCHER: Mutex<Option<MultipathDispatcher>> = Mutex::new(None);
}

#[no_mangle]
pub extern "C" fn uww_init() -> c_int {
    let config = MultipathConfig::default();
    let dispatcher = MultipathDispatcher::new(config);
    let mut global_dispatcher = DISPATCHER.lock().unwrap();
    *global_dispatcher = Some(dispatcher);
    println!("UWW Rust System Initialized with Multipath Dispatcher");
    0
}

#[no_mangle]
pub extern "C" fn uww_fetch_url(url: *const c_char) -> *mut c_char {
    if url.is_null() {
        return std::ptr::null_mut();
    }

    let c_str = unsafe { CStr::from_ptr(url) };
    let url_str = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };

    // In a real implementation, this would be async and use the dispatcher.
    // For FFI simplicity in this synchronous call, we'll simulate a blocking fetch
    // or return a placeholder. Ideally, we'd use a callback or a handle.
    
    // TODO: Hook up actual async runtime here properly.
    // For now, we return a mock response that proves we are in Rust.
    
    let response = format!(
        "<html><body><h1>UWW Secure Fetch</h1><p>Fetched {} via Nudge Mixnet</p></body></html>",
        url_str
    );

    match CString::new(response) {
        Ok(s) => s.into_raw(),
        Err(_) => std::ptr::null_mut(),
    }
}

#[no_mangle]
pub extern "C" fn uww_free_string(s: *mut c_char) {
    if s.is_null() { return; }
    unsafe {
        let _ = CString::from_raw(s);
    }
}

#[no_mangle]
pub extern "C" fn uww_hello() {
    println!("Hello from UWW Rust!");
}
