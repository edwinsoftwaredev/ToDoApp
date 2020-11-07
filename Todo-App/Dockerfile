FROM node:12-alpine as ui-build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ClientApp/package.json ./
COPY ClientApp/package-lock.json ./
RUN npm ci --silent
COPY ClientApp/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out
# After build is completed ClientApp build has to be copied
COPY --from=ui-build /app/build ./out/ClientApp/build/

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Todo-App.dll"]