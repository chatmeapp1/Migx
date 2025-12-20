import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface VoteKickButtonProps {
  target: string;
  remainingVotes: number;
  remainingSeconds: number;
  hasVoted: boolean;
  onVote: () => void;
}

export function VoteKickButton({
  target,
  remainingVotes,
  remainingSeconds,
  hasVoted,
  onVote,
}: VoteKickButtonProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Kicking {target} - {remainingVotes} votes, {remainingSeconds}s left
      </Text>
      <TouchableOpacity onPress={onVote} disabled={hasVoted} style={styles.button}>
        <Text style={styles.buttonText}>{hasVoted ? 'Voted' : 'Vote'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#0a5229',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
