pub fn init() {
    println!("UWW Rust System Initialized");
}

#[no_mangle]
pub extern "C" fn uww_hello() {
    println!("Hello from UWW Rust!");
}
