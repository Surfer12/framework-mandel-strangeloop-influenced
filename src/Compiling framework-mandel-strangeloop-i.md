 Compiling framework-mandel-strangeloop-influenced v0.1.0 (C:\Users\ryano\framework-mandel-strangeloop-influenced)
error[E0117]: only traits defined in the current crate can be implemented for types defined outside of the crate
   --> src\cognitive_anthropic_manager.rs:200:1
    |
200 | impl Serialize for Arc<CognitiveNode> {
    | ^^^^^^^^^^^^^^^^^^^------------------
    |                    |
    |                    `Arc` is not defined in the current crate
    |
    = note: impl doesn't have any local type before any uncovered type parameters
    = note: for more information see https://doc.rust-lang.org/reference/items/implementations.html#orphan-rules        
    = note: define and implement a trait or new type instead

error[E0117]: only traits defined in the current crate can be implemented for types defined outside of the crate        
   --> src\cognitive_anthropic_manager.rs:210:1
    |
210 | impl<'de> Deserialize<'de> for Arc<CognitiveNode> {
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^------------------
    |                                |
    |                                `Arc` is not defined in the current crate
    |
    = note: impl doesn't have any local type before any uncovered type parameters
    = note: for more information see https://doc.rust-lang.org/reference/items/implementations.html#orphan-rules        
    = note: define and implement a trait or new type instead

error[E0195]: lifetime parameters or bounds on method `process` do not match the trait declaration
   --> src\cognitive_anthropic_manager.rs:186:21
    |
179 | #[async_trait]
    | -------------- this bound might be missing in the impl
180 | pub trait AnthropicManager: Send + Sync {
181 |     async fn process(&self) -> Result<()>;
    |              -------------- lifetimes in impl do not match this method in trait
...
186 |     async fn process(&self) -> Result<()> {
    |                     ^ lifetimes do not match method in trait

error[E0195]: lifetime parameters or bounds on method `analyze` do not match the trait declaration
   --> src\cognitive_anthropic_manager.rs:192:21
    |
179 | #[async_trait]
    | -------------- this bound might be missing in the impl
...
182 |     async fn analyze(&self, input: &str) -> Result<Vec<CognitiveNode>>;
    |              --------------------------- lifetimes in impl do not match this method in trait
...
192 |     async fn analyze(&self, input: &str) -> Result<Vec<CognitiveNode>> {
    |                     ^ lifetimes do not match method in trait

Some errors have detailed explanations: E0117, E0195.
For more information about an error, try `rustc --explain E0117`.
error: could not compile `framework-mandel-strangeloop-influenced` (lib) due to 4 previous errors
warning: build failed, waiting for other jobs to finish...