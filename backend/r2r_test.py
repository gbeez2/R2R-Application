from r2r import R2RClient

client = R2RClient("http://localhost:7272")  # explicitly target local server

with open("test.txt", "w") as file:
    file.write("John is a person that works at Google.")

client.documents.create(file_path="test.txt")

# Call RAG directly
rag_response = client.retrieval.rag(
    query="Who is john",
    rag_generation_config={"model": "openai/gpt-4o-mini", "temperature": 0.0},
)

print(f"Search Results:\n{rag_response.results.search_results}")
# AggregateSearchResult(chunk_search_results=[ChunkSearchResult(score=0.685, text=John is a person that works at Google.)], graph_search_results=[], web_search_results=[], context_document_results=[])

print(f"Completion:\n{rag_response.results.generated_answer}")
# John is a person that works at Google [e123456].

print(f"Citations:\n{rag_response.results.citations}")
# [Citation(id='e123456', object='citation', payload=ChunkSearchResult(...))]
