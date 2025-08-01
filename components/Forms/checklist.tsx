import { useTickedTeam } from '@/hooks/store';
import { Fonts } from '@/hooks/useFont';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  id: number;
  label: string;
};

export default function Checklist({ id, label }: Props) {
  const { teamsSelected, updateTeamsSelected } = useTickedTeam();
  const checked = teamsSelected.includes(id);
  const rank = checked ? teamsSelected.length - teamsSelected.indexOf(id) : null;

  return (
    <TouchableOpacity
      onPress={() => updateTeamsSelected(id)}
      activeOpacity={0.7}
      style={[styles.container, checked && styles.containerChecked]}
    >
      <Text style={[styles.label, checked ? styles.labelChecked : styles.labelUnchecked]}>
        {label}
      </Text>

      {checked && (
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  containerChecked: {
    backgroundColor: '#dc2626',
    borderColor: '#b91c1c',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 20,
    flex: 1,
  },
  labelChecked: {
    color: 'white',
    fontFamily: Fonts.Shrikhand,
  },
  labelUnchecked: {
    color: 'white',
    fontFamily: Fonts.Inter,
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
});
