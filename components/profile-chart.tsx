export function ProfileChart({
  data
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const width = 1000;
  const height = 280;
  const min = Math.min(...data.map((point) => point.value));
  const max = Math.max(...data.map((point) => point.value));
  const range = Math.max(max - min, 1);

  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * (width - 60) + 20;
      const y = height - ((point.value - min) / range) * (height - 60) - 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="panel chart-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">History</p>
          <h2>P&amp;L Curve</h2>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="P and L chart">
        <polyline fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" points={`20,${height - 30} ${width - 20},${height - 30}`} />
        <polyline fill="none" stroke="#2ee68b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" points={points} />
      </svg>
      <div className="chart-labels" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        {data.length > 0 && (
          <>
            <span className="muted">{data[0].label}</span>
            <span className="muted">{data[Math.floor(data.length / 2)].label}</span>
            <span className="muted">{data[data.length - 1].label}</span>
          </>
        )}
      </div>
    </div>
  );
}
