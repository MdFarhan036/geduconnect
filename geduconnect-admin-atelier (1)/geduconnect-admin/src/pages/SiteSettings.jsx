import { useEffect, useState } from "react";
import api from "../api";

export default function SiteSettings() {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    api.get("/admin/settings").then(res => setSettings(res.data));
  }, []);

  const update = async (key, value) => {
    await api.put(`/admin/settings/${key}`, { setting_value: value });
    alert("Saved");
  };

  return (
    <>
      <h2>Site Settings</h2>

      {settings.map(s => (
        <div key={s.setting_key} style={{ marginBottom: 15 }}>
          <label>{s.setting_key}</label>
          <input
            value={s.setting_value || ""}
            onChange={e =>
              setSettings(settings.map(x =>
                x.setting_key === s.setting_key
                  ? { ...x, setting_value: e.target.value }
                  : x
              ))
            }
          />
          <button onClick={() => update(s.setting_key, s.setting_value)}>
            Save
          </button>
        </div>
      ))}
    </>
  );
}
