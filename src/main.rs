use anyhow::Result;
use async_trait::async_trait;
use log::info;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::sync::Arc;

#[derive(Serialize, Deserialize, Debug)]
pub struct CognitiveNode {
    pub id: u32,
    pub info: String,
}

#[async_trait]
pub trait AnthropicManager: Send + Sync {
    async fn process(&self) -> Result<()>;
    async fn analyze(&self, input: &str) -> Result<Vec<CognitiveNode>>;
}

pub struct MyAnthropicManager;

#[async_trait]
impl AnthropicManager for MyAnthropicManager {
    async fn process(&self) -> Result<()> {
        info!("Starting cognitive processing");
        // Simulated async work (you can replace with actual logic)
        Ok(())
    }

    async fn analyze(&self, input: &str) -> Result<Vec<CognitiveNode>> {
        info!("Analyzing input: {}", input);
        // Simulated analysis returning a dummy node
        Ok(vec![CognitiveNode {
            id: 1,
            info: format!("Processed: {}", input),
        }])
    }
}

// Implement serialization for Arc<CognitiveNode>
impl Serialize for Arc<CognitiveNode> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        (**self).serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for Arc<CognitiveNode> {
    fn deserialize<D>(deserializer: D) -> Result<Arc<CognitiveNode>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let node = CognitiveNode::deserialize(deserializer)?;
        Ok(Arc::new(node))
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init(); // Initialize logger if you want to see info logs
    let manager = MyAnthropicManager;

    manager.process().await?;
    let nodes = manager.analyze("Hello World").await?;
    println!("Analysis Result: {:?}", nodes);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_anthropic_manager() -> Result<()> {
        let manager = MyAnthropicManager;

        // Test process method
        manager.process().await?;

        // Test analyze method
        let nodes = manager.analyze("Test input").await?;
        assert!(!nodes.is_empty(), "Expected at least one CognitiveNode");
        assert_eq!(nodes[0].id, 1, "Expected CognitiveNode id to be 1");

        Ok(())
    }
}
