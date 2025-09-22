Sub Main () 
' ===== CST VBA + WinHTTP: API test & OpenRouter chat =====
' Works with late binding, so no References dialog needed.

    ' Minimal POST to OpenRouter /v1/chat/completions using WinHTTP
    Dim apiKey As String, model As String, userPrompt As String
    Dim url As String, body As String
    Dim http As Object, resp As String, content As String

    apiKey = "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"
    model = "mistralai/mistral-7b-instruct"  ' change if you like
    url = "https://openrouter.ai/api/v1/chat/completions"

    ' Ask the user for a prompt (or hardcode one)
    userPrompt = InputBox("Enter your prompt for the model:", "OpenRouter via CST", "Suggest a parametric horn antenna in CST.")
    If Len(userPrompt) = 0 Then Exit Sub

    ' Build JSON body (simple string; escaping quotes in prompt minimally)
    body = "{""model"":""" & model & """,""messages"":[{""role"":""user"",""content"":""" & JsonEscape(userPrompt) & """}]}"

    On Error GoTo EH
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.Open "POST", url, False
    http.SetRequestHeader "Content-Type", "application/json"
    http.SetRequestHeader "Authorization", "Bearer " & apiKey
    ' Optional but recommended headers per OpenRouter docs:
    ' http.SetRequestHeader "HTTP-Referer", "https://your-app-or-domain.example"
    ' http.SetRequestHeader "X-Title", "CST VBA Macro"

    http.SetTimeouts 10000, 15000, 60000, 60000
    http.Send body

    If http.Status = 200 Then
        resp = http.ResponseText
        content = ExtractFirstChoiceMessageContent(resp)
        If Len(content) = 0 Then
            MsgBox "Request succeeded, but couldn't find 'choices[0].message.content'." & vbCrLf & "Raw (first 800 chars):" & vbCrLf & Left$(resp, 800)
        Else
            ' Show the AI reply. In CST you can also use MsgInfo if available; MsgBox is universal.
            MsgBox "AI reply:" & vbCrLf & content
        End If
    Else
        MsgBox "OpenRouter error. Status: " & http.Status & vbCrLf & http.ResponseText
    End If
    Exit Sub
EH:
    MsgBox "WinHTTP POST error: " & Err.Description
End Sub

' --- HELPERS ---

Private Function ExtractFirstChoiceMessageContent(ByVal json As String) As String
    ' Very lightweight extractor for: choices[0].message.content
    ' Uses VBScript.RegExp (no references needed).
    ' Note: This is naive and assumes content is a JSON string on a single logical line.
    On Error GoTo EH
    Dim re As Object, m As Object, s As String

    Set re = CreateObject("VBScript.RegExp")
    re.Pattern = """choices""\s*:\s*\[\s*\{.*?""message""\s*:\s*\{.*?""content""\s*:\s*""((?:[^""\\]|\\.)*)"""
    re.Global = False
    re.MultiLine = True
    re.IgnoreCase = True

    If re.Test(json) Then
        Set m = re.Execute(json)(0)
        s = m.SubMatches(0)
        ExtractFirstChoiceMessageContent = JsonUnescape(s)
        Exit Function
    End If
EH:
    ExtractFirstChoiceMessageContent = ""
End Function

Private Function JsonEscape(ByVal s As String) As String
    ' Minimal escaper for double quotes and backslashes; adds \n for newlines
    s = Replace(s, "\", "\\")
    s = Replace(s, """", "\""")
    s = Replace(s, vbCrLf, "\n")
    s = Replace(s, vbCr, "\n")
    s = Replace(s, vbLf, "\n")
    JsonEscape = s
End Function

Private Function JsonUnescape(ByVal s As String) As String
    ' Minimal unescaper for \" \\ and \n \r \t
    s = Replace(s, "\n", vbCrLf)
    s = Replace(s, "\r", vbCrLf)
    s = Replace(s, "\t", vbTab)
    s = Replace(s, "\\", "\")
    s = Replace(s, "\""", """")
    JsonUnescape = s
End Function