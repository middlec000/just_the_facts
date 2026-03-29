{
  description = "Just the Facts - A social media meets Wikipedia web application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            nodePackages.typescript
            nodePackages.prettier
            nodePackages.eslint
            cloudflared
          ];

          shellHook = ''
            echo "Welcome to Just the Facts development environment!"
            echo "Use 'npm run dev' to start the development server"
            echo "Use 'npm run build' to build the production version"
            echo "Use 'npm run start' to start the production server"
          '';
        };
      }
    );
}
