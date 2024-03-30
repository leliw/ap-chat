from pydantic import BaseModel


class ChatMessage(BaseModel):
    channel: str = "chatbot"
    text: str


class Chat:
    def get_answer(self, question: str) -> ChatMessage:
        """Get answer for the question"""
        q = question.strip().lower()
        if q == "help":
            return self.get_help_answer()
        else:
            return ChatMessage(text="I don't understand you")

    def get_help_answer(self) -> ChatMessage:
        """Return help answer"""
        return ChatMessage(text="I can help, but I don't know how yet.")
