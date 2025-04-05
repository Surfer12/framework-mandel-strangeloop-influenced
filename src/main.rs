use anyhow::Result;
use framework_mandel_strangeloop_influenced::CognitiveAnthropicManager;
use log::info;
use dotenv::dotenv;

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables from .env file
    dotenv().ok();
    
    // Initialize logging
    env_logger::init();
    info!("Starting CognitiveAnthropicManager test");

    // Create a new instance of CognitiveAnthropicManager
    let api_key = std::env::var("ANTHROPIC_API_KEY")
        .expect("Please set ANTHROPIC_API_KEY in .env file");
    let api_version = std::env::var("ANTHROPIC_API_VERSION")
        .unwrap_or_else(|_| "2023-06-01".to_string());
    
    let mut manager = CognitiveAnthropicManager::new(api_key, api_version);

    // Test input
    let test_input = "Analyze the concept of recursive cognitive patterns in artificial intelligence systems.";

    // Process the input
    let output = manager.begin_cognitive_process(test_input.into()).await?;
    
    info!("Processing completed successfully");
    info!("Output: {:?}", output);

    Ok(())
}
