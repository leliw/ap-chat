class Chat:
    def get_answer(self, question: str) -> dict[str, str]:
        """Get answer for the question"""
        q = question.strip().lower()
        if q == "help":
            return self.get_help_answer()
        else:
            return {"channel": "chatbot", "text": "I don't understand you"}

    def get_help_answer(self) -> dict[str, str]:
        """Return help answer"""
        return {"channel": "chatbot", "text": "I can help, but I don't know how yet."}
