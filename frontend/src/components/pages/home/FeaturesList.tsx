import "./FeaturesList.scss";

export default function FeaturesList() {
  return (
    <div className="FeaturesList">
      <div className="FeaturesList-Header">
        <h1>FEATURES LIST</h1>
        <div>
          <span>✅ Supported</span>
          <span>🛠️ Planned</span>
        </div>
      </div>
      <ul>
        <b>NUMBER OF PLAYERS</b>
        <li className="checked">5 Handed</li>
        <li>4 Handed</li>
        <li>3 Handed</li>

        <b>SCORING</b>
        <li>Blitzing</li>
        <li>Cracking</li>
        <li className="checked">Double on the Bump</li>

        <b>NO PICKER SCENARIOS</b>
        <li>Doublers</li>
        <li className="checked">Leasters</li>
        <li className="checked">Mosters</li>
        <li className="checked">Screw the Dealer</li>

        <b>PARTNER CALL</b>
        <li className="checked">Call an Ace</li>
        <li className="checked">Jack of Diamonds</li>

        <b>MISC.</b>
        <li className="checked">Private Games</li>
        <li>Public Games</li>
        <li>Player Stats</li>
        <li>Leaderboards</li>
        <li className="checked">Card Sounds</li>
        <li>Card Animations</li>
      </ul>
    </div>
  );
}
