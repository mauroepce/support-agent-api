# Support Agent API 🤖

## Overview

This project aims to build an AI-powered support agent API using Langchain's LLM and HCAT models. It serves as a middleware for companies who need an automated support system. The support agent not only interacts with the internal customer to provide knowledge base information but also creates tickets in Jira Service Management when needed.

## Features

- **User Dashboard**: For users to integrate their knowledge base.
- **Multi-Platform Support**: Integration with Jira Service Management and WhatsApp.
- **AI-Powered**: Utilizes Langchain LLM and HCAT models for natural language understanding.
- **Ticketing System**: Automatically generates support tickets with provided information.

## Technology Stack

- **Back-end**: Nest.js with TypeScript
- **Database**: MongoDB

## How It Works

1. **User Registration**: Companies can register and gain access to a dashboard.
2. **Knowledge Base Integration**: Users can integrate their existing knowledge base with the support agent.
3. **Platform Integration**: Connect with platforms like Jira Service Management and WhatsApp.
4. **AI Interactions**: AI agent responds to internal customer queries based on the connected knowledge base.
5. **Ticket Generation**: If the AI agent cannot resolve an issue, it will prompt to generate a Jira ticket.

## Coming Soon

- More comprehensive documentation
- Setup and installation guidelines
- API Reference

## License

MIT License
