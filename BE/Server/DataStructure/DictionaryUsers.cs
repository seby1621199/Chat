namespace Server.DataStructure
{
    class DictionaryUsers : Dictionary<string, string>
    {
        public event EventHandler? DictionaryModified;

        public new void Add(string key, string value)
        {
            base.Add(key, value);
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

        protected virtual void OnDictionaryModified(EventArgs e)
        {
            DictionaryModified?.Invoke(this, e);
        }
    }
}
