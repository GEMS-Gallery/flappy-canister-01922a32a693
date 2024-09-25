export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addHighScore' : IDL.Func([IDL.Text, IDL.Nat], [], []),
    'getHighScores' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
