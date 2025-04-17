namespace Chat.Models;

public class DictionaryUsers : Dictionary<string, UserData>
{
    public event EventHandler? DictionaryModified;

    public void Add(string username, string connectionId, string color)
    {
        base.Add(username, new UserData(connectionId, color));
        OnDictionaryModified(EventArgs.Empty);
    }

    public new bool Remove(string key)
    {
        var result = base.Remove(key);
        if (result)
        {
            OnDictionaryModified(EventArgs.Empty);
        }
        return result;
    }

    public bool TryGetConnectionId(string username, out string connectionId)
    {
        if (TryGetValue(username, out var userData))
        {
            connectionId = userData.ConnectionId;
            return true;
        }
        connectionId = string.Empty;
        return false;
    }

    public bool TryGetColor(string username, out string color)
    {
        if (TryGetValue(username, out var userData))
        {
            color = userData.Color;
            return true;
        }
        color = string.Empty;
        return false;
    }

    public void UpdateColor(string username, string newColor)
    {
        if (TryGetValue(username, out var userData))
        {
            userData.Color = newColor;
            OnDictionaryModified(EventArgs.Empty);
        }
    }

    protected virtual void OnDictionaryModified(EventArgs e)
    {
        DictionaryModified?.Invoke(this, e);
    }
}