import React from 'react';
import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { FaBuilding, FaBolt } from 'react-icons/fa';

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  const suggestions = [
    {
      icon: <HomeIcon className="size-5" />,
      title: "Rural Housing Rehabilitation",
      description: "Learn about housing programs and assistance",
      prompt: "What resources does ISU Extension offer for rural housing rehabilitation?"
    },
    {
      icon: <FaBuilding className="size-5" />,
      title: "Community Development",
      description: "Explore community development initiatives",
      prompt: "Can you explain ISU Extension's community development programs?"
    },
    {
      icon: <ChatBubbleIcon className="size-5" />,
      title: "Housing Needs Assessment",
      description: "Get help with housing assessments",
      prompt: "How can ISU Extension help with conducting a housing needs assessment?"
    },
    {
      icon: <FaBolt className="size-5" />,
      title: "Rural Development",
      description: "Discover rural development programs",
      prompt: "What are ISU Extension's current rural development initiatives?"
    }
  ];

  return (
    <Box className="p-8 max-w-4xl mx-auto">
      <Card className="mb-8 p-6">
        <Flex direction="column" gap="4">
          <Text size="8" weight="bold" align="center">
            Welcome to Iowa State University Extensions and Outreach
          </Text>
          <Text size="4" color="gray" align="center">
            Community and Economic Development (CED)
          </Text>
          <Text align="center" className="max-w-2xl mx-auto">
            Ask me about housing, community development, and rural initiatives in Iowa. 
            I'm here to help you find information about ISU Extension's programs and services.
          </Text>
        </Flex>
      </Card>
      
      <Text size="6" weight="medium" className="mb-4">
        Suggested Topics
      </Text>
      
      <Flex gap="4" wrap="wrap">
        {suggestions.map((suggestion, index) => (
          <Card
            key={index}
            className="flex-1 min-w-[250px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSuggestionClick(suggestion.prompt)}
          >
            <Flex direction="column" gap="3" className="p-4">
              <Flex 
                align="center" 
                justify="center" 
                className="w-10 h-10 rounded-full bg-red-100"
              >
                {suggestion.icon}
              </Flex>
              <Text weight="bold">{suggestion.title}</Text>
              <Text size="2" color="gray">
                {suggestion.description}
              </Text>
              <Button variant="soft" size="2">
                Ask about this
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};

export default WelcomeScreen;