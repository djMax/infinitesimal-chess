import { makeStyles } from '@rneui/themed';

export const useStyles = makeStyles((theme) => ({
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: '600',
    paddingBottom: 5,
    paddingLeft: 15,
    fontSize: 18,
  },
  settingsContainer: {
    flex: 1,
  },
  chevron: {
    color: theme.colors.grey4,
  },
  rightText: {
    color: theme.colors.grey2,
  },
}));
