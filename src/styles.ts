import { makeStyles } from "@rneui/themed";

export const useStyles = makeStyles((theme) => ({
  boardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontWeight: '600',
    paddingBottom: 5,
    paddingLeft: 15,
    fontSize: 18,
  },
  settingsContainer: {
    marginTop: 20,
    flex: 1,
  },
}));
