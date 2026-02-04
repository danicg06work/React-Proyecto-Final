import './PlatformMenu.css';

const platforms = [
  { id: '', label: 'Todas' },
  { id: 'ps5', label: 'PS5' },
  { id: 'switch', label: 'Switch' },
  { id: 'android', label: 'Android' },
  { id: 'pc', label: 'PC' },
  { id: 'ios', label: 'iOS' },
  { id: 'xbox', label: 'Xbox One' },
];

const PlatformMenu = ({ name = 'platform', selectedPlatform = '', setSelectedPlatform = () => {} }) => {
  return (
    <form className="platform-menu" aria-label="Plataforma">
      {platforms.map((p) => (
        <label key={p.id || 'all'} className="platform-option">
          <input
            type="radio"
            name={name}
            value={p.id}
            checked={selectedPlatform === p.id}
            onChange={() => setSelectedPlatform(p.id)}
          />
          <span className="platform-option__label">{p.label}</span>
        </label>
      ))}
    </form>
  );
};

export default PlatformMenu;