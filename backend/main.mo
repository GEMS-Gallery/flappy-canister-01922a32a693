import Func "mo:base/Func";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Order "mo:base/Order";

actor {
  // Stable variable to store high scores
  stable var highScores : [(Text, Nat)] = [];

  // Function to add a new high score
  public func addHighScore(name : Text, score : Nat) : async () {
    highScores := Array.sort(
      Array.append(highScores, [(name, score)]),
      func (a : (Text, Nat), b : (Text, Nat)) : Order.Order {
        Int.compare(b.1, a.1) // Sort in descending order
      }
    );

    // Keep only top 10 scores
    if (highScores.size() > 10) {
      highScores := Iter.toArray(Array.slice(highScores, 0, 10));
    };
  };

  // Function to get high scores
  public query func getHighScores() : async [(Text, Nat)] {
    highScores
  };
}
