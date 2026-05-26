"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import css from "./settings.module.css";
import { User, Globe, Lock } from "lucide-react";

const countries = [
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  if (status === "loading") return <Loader />;
  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // !!!!! бэкенд
      console.log("Сохраняем данные на бэкенд:", { name, country });

      alert("OK!");
    } catch (err) {
      console.error("err:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={css.container}>
      <section className={css.header}>
        <h1 className={css.title}>Settings</h1>
      </section>
      <form onSubmit={handleSubmit} className={css.formWrapper}>
        {/* БЛОК 1: ЛИЧНЫЕ ДАННЫЕ */}
        <div className={css.dataBoxContainer}>
          <section>
            <h2 className={css.sectionTitle}>Personal data</h2>
            <div className={css.infoBlock}>
              <div className={css.inputGroup}>
                <label className={css.label}>Your nickname</label>
                <div className={css.disabledInputWrapper}>
                  <input
                    type="text"
                    className={css.inputDisabled}
                    value={session.user.nickname || session.user.name || ""}
                    disabled
                  />
                  <Lock size={14} className={css.lockIcon} />
                </div>
                {/* <p className={css.hint}>
              Nickname is used for authentication and cannot be changed.
            </p> */}
              </div>
              <div className={css.inputGroup}>
                <label className={css.label} htmlFor="nameInput">
                  Name
                </label>
                <input
                  id="nameInput"
                  type="text"
                  className={css.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={25}
                  required
                />
                {/* <p className={css.hint}>
              This name will be seen by other players in leagues and tables.
            </p> */}
              </div>
            </div>
          </section>
          {/* БЛОК 2: ГЕОГРАФИЯ */}
          <section>
            <h2 className={css.sectionTitle}>Country</h2>
            <div className={css.infoBlock}>
              <div className={css.inputGroup}>
                {/* <label className={css.label} htmlFor="countrySelect">
                  Country
                </label> */}
                <select
                  id="countrySelect"
                  className={css.select}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Choose your country...</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} &nbsp; {c.name}
                    </option>
                  ))}
                </select>
                {/* <p className={css.hint}>
              Рядом с вашим профилем в лидерборде будет отображаться флаг этой
              страны.
            </p> */}
              </div>
            </div>
          </section>

          <div className={css.actionsRow}>
            <button type="submit" disabled={isSaving} className={css.saveBtn}>
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
