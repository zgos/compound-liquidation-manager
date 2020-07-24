import React, { useState } from "react";
import MenuItem from "../menuItem";
import CopyToClipboard from "react-copy-to-clipboard";
import { Toolbar, Chip, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileCopy from "@material-ui/icons/FileCopyOutlined";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  separator: {
    display: "flex",
    flex: 1,
  },
  logo: {
    height: 36,
  },
  network: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingLeft: 8,
    paddingRight: 8,
  },
  address: {
    textTransform: "uppercase",
    paddingLeft: 8,
    paddingRight: 10,
    marginRight: theme.spacing(3)
  },
  toolbar: {
    width: '48%',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(1),
    margin: 'auto'
  }
}));

const AppHeader = ({ selected, handleSelected, network, address }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  return (
    <Toolbar className={classes.toolbar}>
      <MenuItem selected={selected} handleSelected={handleSelected} />
      <Chip label={network} size="small" className={classes.network} />
      <div className={classes.separator} />
      <CopyToClipboard text={address} onCopy={onCopy}>
        <Tooltip title={copied ? "Copied!" : "Click to copy"}>
          <Chip
            className={classes.address}
            variant={copied ? 'default' : "outlined"}
            color={copied ? "primary" : "default"}
            label={address}
            deleteIcon={<FileCopy fontSize="small" />}
            onDelete={onCopy}
          />
        </Tooltip>
      </CopyToClipboard>
    </Toolbar>
  );
};

const mapStateToProps = (state) => ({
  address: state.userReducer.userAddress,
  network: state.userReducer.network
});


export default connect(mapStateToProps, null)(AppHeader);
