public class Prefix {
    public static void main(String[] args) {
      String strs[] = {"flower","flow","flight"};
       longestCommonPrefix(strs);
    }
    static String longestCommonPrefix(String[] strs){
        int i=0,j=0;
         while(i<strs.length){
            int j=strs[i].length();
            while(j!='\0'){
                if(strs[i].charAt(j) == strs[i+1].charAt(j)){
                if(strs[i+1].charAt(j) == strs[i+2].charAt(j)){
                    System.out.println(strs[i+2].charAt(j));
                    
                }}
            }
       
     }
     return "";
}
}
