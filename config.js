// Koppeling met de gezinsdatabase (Supabase). Deze sleutels zijn bedoeld voor gebruik in de browser.
// Zet hier NOOIT de service_role key.
window.GEZINSPLAN_CONFIG = {
  supabaseUrl: "https://sgncjmwjoudtxnjtfcnn.supabase.co",
  supabaseKey: "sb_publishable_Omf8FGEJ6DcJfsOmMxjMyg_MsvgLuhY",
  // Wie is wie: bij inloggen opent de app meteen het juiste profiel.
  leden: [
    { email: "info@groeikrachtengeestdrift.nl", persoon: "p1" },
    { email: "pentermanlaura@gmail.com", persoon: "p2" }
  ]
};
