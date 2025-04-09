use anyhow::Result;
use dotenv::dotenv;
use framework_mandel_strangeloop_influenced::CognitiveAnthropicManager;
use framework_mandel_strangeloop_influenced::cognitive_anthropic_manager::{
    AnthropicManager, CognitiveMetadata,
};
use log::info;
use std::path::Path;

/// Helper function to create metadata with common parameters
fn create_metadata(source: &str, confidence: f32, tags: Vec<&str>) -> CognitiveMetadata {
    CognitiveMetadata {
        confidence,
        source: source.to_string(),
        timestamp: chrono::Utc::now().timestamp(),
        tags: tags.into_iter().map(|s| s.to_string()).collect(),
    }
}

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
    
    // Create a new manager for the second example
    let mut second_manager = CognitiveAnthropicManager::new();

    // Add initial seed insight to the second manager
    second_manager.add_node(
        "root",
        "Communication patterns often mirror fractal mathematics".to_string(),
        create_metadata("user", 0.9, vec!["communication", "fractal"]),
    )?;

    // This automatically triggers processing, but we can also manually process
    // if we've added multiple nodes without processing
    second_manager.process().await?;

    // Save the state for later restoration
    second_manager.save_to_file(Path::new("evolved_cognitive_state.json"))?;

    // Export the tree for visualization or analysis
    let _second_tree_json = second_manager.export_node_tree()?;
    
    // Save the original manager state
    manager.save_to_file(save_path)?;

    // Export the node tree from the original manager
    let tree_json = manager.export_node_tree()?;
    info!("Exported node tree: {}", tree_json);

    // Demonstrate loading from file
    let _loaded_manager = CognitiveAnthropicManager::load_from_file(save_path)?;
    info!("Successfully loaded manager from file");

    // Demonstrate importing a node tree
    manager.import_node_tree(&tree_json)?;
    info!("Successfully imported node tree");

    info!("Cognitive processing completed");
    Ok(())
}
