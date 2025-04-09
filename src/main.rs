use anyhow::Result;
use framework_mandel_strangeloop_influenced::CognitiveAnthropicManager;
use framework_mandel_strangeloop_influenced::cognitive_anthropic_manager::{CognitiveMetadata, AnthropicManager};
use log::info;
use dotenv::dotenv;
use std::path::Path;

#[tokio::main]
async fn main() -> Result<()> {       
    // Load environment variables from .env file
    dotenv().ok();
    
    // Initialize logger
    env_logger::init();
    
    info!("Starting cognitive framework");
    
    // Create a new cognitive manager
    let mut manager = CognitiveAnthropicManager::new();
    
    // Add some initial cognitive nodes
    let metadata = CognitiveMetadata {
        confidence: 0.9,
        source: "user_input".to_string(),
        timestamp: chrono::Utc::now().timestamp(),
        tags: vec!["initial".to_string(), "test".to_string()],
    };
    
    manager.add_node(
        "root",
        "Initial cognitive exploration".to_string(),
        metadata,
    )?;
    
    // Process the cognitive tree
    manager.process().await?;
    
    // Save the current state
    let save_path = Path::new("cognitive_state.json");
    manager.save_to_file(save_path)?;
    
    // Export the node tree
    let tree_json = manager.export_node_tree()?;
    info!("Exported node tree: {}", tree_json);
    
    // Demonstrate loading from file
    let loaded_manager = CognitiveAnthropicManager::load_from_file(save_path)?;
    info!("Successfully loaded manager from file");
    
    // Demonstrate importing a node tree
    manager.import_node_tree(&tree_json)?;
    info!("Successfully imported node tree");
    
    info!("Cognitive processing completed");
    Ok(())
}
