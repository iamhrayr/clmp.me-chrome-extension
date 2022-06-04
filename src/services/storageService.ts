class StorageService {
  private async extensionGet() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, (data) => {
        resolve(data);
      });
    });
  }

  private async extensionSet(data: Object) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        resolve(true);
      });
    });
  }

  private browserGet() {
    const items = { ...localStorage };
    const res: any = {};

    Object.keys(items).forEach((key) => {
      let item;

      try {
        item = JSON.parse(items[key]);
      } catch (e) {
        item = items[key];
      }

      res[key] = item;
    });

    return res;
  }

  private browserSet(data: Object) {
    Object.keys(data).forEach((key) => {
      let dataToStore = (data as any)[key];
      if (typeof dataToStore === "object") {
        dataToStore = JSON.stringify(dataToStore);
      }

      localStorage.setItem(key, dataToStore);
    });
  }

  private extensionClear() {
    return chrome.storage.local.clear();
  }

  private browserClear() {
    return localStorage.clear();
  }

  private isExtension() {
    return !!chrome.storage;
  }

  async get() {
    return this.isExtension() ? this.extensionGet() : this.browserGet();
  }

  async set(data: Object) {
    return this.isExtension() ? this.extensionSet(data) : this.browserSet(data);
  }

  async clear() {
    return this.isExtension() ? this.extensionClear() : this.browserClear();
  }
}

export default new StorageService();
