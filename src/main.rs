use anyhow::Result;
use framework_mandel_strangeloop_influenced::cognitive_anthropic_manager::{CognitiveAnthropicManager, AnthropicManager, CognitiveMetadata};
use std::path::Path;
use chrono::Utc;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();
    
    let mut manager = CognitiveAnthropicManager::new();
    
    manager.add_node("root", "Sample node content".to_string(), CognitiveMetadata {
        confidence: 0.9,
        source: "user".to_string(),
        timestamp: Utc::now().timestamp(),
        tags: vec!["sample".to_string()],
    })?;
    
    manager.process().await?;
    
    let tree_json = manager.export_node_tree()?;
    println!("Node Tree: {}", tree_json);
    
    let path = Path::new("cognitive_state.json");
    manager.save_to_file(&path)?;
    println!("Saved cognitive state to {:?}", path);
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_anthropic_manager() -> Result<()> {
        let mut manager = CognitiveAnthropicManager::new();

        manager.process().await?;

        manager.add_node("root", "Test content".to_string(), CognitiveMetadata {
            confidence: 0.8,
            source: "test".to_string(),
            timestamp: Utc::now().timestamp(),
            tags: vec!["test".to_string()],
        })?;
        
        let tree_json = manager.export_node_tree()?;
        assert!(!tree_json.is_empty(), "Expected non-empty tree JSON");

        Ok(())
    }
}
