import { useState } from 'react';

type Props = {
  length?: number;               // longueur du code (ex: 4)
  onSubmit: (code: string) => void;
  onCancel?: () => void;
  title?: string;
};

export default function Numpad({ length = 4, onSubmit, onCancel, title = 'Enter Passcode' }: Props) {
  const [pin, setPin] = useState<string>('');

  const push = (d: string) => {
    if (pin.length < length) setPin(pin + d);
  };
  const back = () => setPin(p => p.slice(0, -1));
  const clear = () => setPin('');
  const validate = () => {
    if (pin.length === length) onSubmit(pin);
  };

  const Dot = ({ filled }: { filled: boolean }) => (
    <span style={{
      display:'inline-block', width:10, height:10, borderRadius:'50%',
      background: filled ? '#111' : '#ccc', margin:'0 4px'
    }}/>
  );

  return (
    <div style={{
      background:'#1b1b1b', color:'#eee', padding:16, borderRadius:12,
      width:320, boxShadow:'0 10px 24px rgba(0,0,0,.25)'
    }}>
      <div style={{fontWeight:700, marginBottom:12, textAlign:'center'}}>{title}</div>

      <div style={{textAlign:'center', marginBottom:12}}>
        {Array.from({length}).map((_,i) => <Dot key={i} filled={i < pin.length} />)}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
        {['7','8','9','4','5','6','1','2','3','C','0','⌫'].map(key => (
          <button
            key={key}
            onClick={()=>{
              if (key === 'C') return clear();
              if (key === '⌫') return back();
              push(key);
            }}
            style={{
              padding:'14px 0', border:'1px solid #333', background:'#222',
              color:'#eee', borderRadius:8, fontSize:18, cursor:'pointer'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        {onCancel && (
          <button onClick={onCancel} style={{flex:1, padding:'10px 0', border:'1px solid #444', background:'#2b2b2b', color:'#ddd', borderRadius:8}}>
            Cancel
          </button>
        )}
        <button
          onClick={validate}
          disabled={pin.length !== length}
          style={{
            flex:1, padding:'10px 0', border:'none',
            background: pin.length === length ? '#e11d48' : '#444',
            color:'#fff', borderRadius:8, fontWeight:700, cursor:'pointer'
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
}
